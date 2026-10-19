import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 1. Tailwind Class Merger (`cn`)
 * Intelligently merges Tailwind CSS classes without style conflicts.
 * Essential for building reusable, heavily stylized Framer Motion components.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 2. Slug Generator
 * Converts any game title (e.g., "The Wood Walker: Nightmare Begins") 
 * into a URL-safe string ("the-wood-walker-nightmare-begins").
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphens
    .replace(/(^-|-$)+/g, "");   // Remove leading or trailing hyphens
}

/**
 * 3. Studio Date Formatter
 * Formats standard database timestamps into a clean, editorial layout 
 * (e.g., "October 2026" or "10.24.2026") for your project deployment dates.
 */
export function formatDeploymentDate(
  dateString: string | Date, 
  format: "full" | "compact" = "full"
): string {
  const date = new Date(dateString);
  
  if (format === "compact") {
    // Returns: 10.24.2026
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }).replace(/\//g, ".");
  }

  // Returns: October 2026
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

/**
 * 4. Delay / Sleep Utility
 * Useful for artificially slowing down loading states during cinematic transitions
 * or preventing API rate limits.
 */
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));