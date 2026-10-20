import { RAZORPAY_KEY_ID } from "@/constants";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

/**
 * Dynamically loads the Razorpay checkout script if not already present.
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay SDK.");
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export interface RazorpayPaymentOptions {
  amountInINR: number;
  teamName: string;
  teamSize: number;
  eventTitle: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  onSuccess: (paymentId: string) => void;
  onDismiss?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Opens the Razorpay Checkout modal directly in the client browser.
 * Works seamlessly on static hosting like GitHub Pages.
 */
export async function openRazorpayCheckout(options: RazorpayPaymentOptions): Promise<void> {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    throw new Error("Unable to load Razorpay payment gateway. Please check your internet connection.");
  }

  // Amount in paise (1 INR = 100 paise)
  const amountInPaise = Math.round(options.amountInINR * 100);

  const rzpOptions = {
    key: RAZORPAY_KEY_ID,
    amount: amountInPaise,
    currency: "INR",
    name: "OuterGazers Studio",
    description: `${options.eventTitle} · ${options.teamName} (${options.teamSize} Gazers)`,
    image: "/images/logo_v2.png",
    handler: function (response: { razorpay_payment_id: string }) {
      if (response && response.razorpay_payment_id) {
        options.onSuccess(response.razorpay_payment_id);
      } else {
        options.onSuccess(`pay_demo_${Date.now()}`);
      }
    },
    prefill: {
      name: options.leaderName,
      email: options.leaderEmail,
      contact: options.leaderPhone,
    },
    notes: {
      team_name: options.teamName,
      event: options.eventTitle,
      team_size: options.teamSize.toString(),
    },
    theme: {
      color: "#00b4d8",
      backdrop_color: "rgba(10, 10, 10, 0.95)",
    },
    modal: {
      ondismiss: function () {
        if (options.onDismiss) {
          options.onDismiss();
        }
      },
      escape: true,
      animation: true,
    },
  };

  try {
    const rzp = new window.Razorpay(rzpOptions);
    rzp.on("payment.failed", function (response: { error: { description: string } }) {
      console.error("Payment failed:", response.error);
      if (options.onError) {
        options.onError(new Error(response.error.description || "Payment failed."));
      }
    });
    rzp.open();
  } catch (err) {
    console.error("Error launching Razorpay:", err);
    if (options.onError) {
      options.onError(err instanceof Error ? err : new Error("Failed to open Razorpay modal"));
    }
  }
}
