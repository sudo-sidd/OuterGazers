"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  targetDate?: string;
}

export default function EventCountdown({ targetDate = "2026-11-14T18:00:00+05:30" }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HOURS", value: timeLeft.hours },
    { label: "MINS", value: timeLeft.minutes },
    { label: "SECS", value: timeLeft.seconds },
  ];

  return (
    <div className="inline-flex items-center gap-2 sm:gap-4 p-2 sm:p-3 bg-black/60 border border-zinc-800 rounded-lg backdrop-blur-md">
      {units.map((unit, idx) => (
        <div key={unit.label} className="flex items-center gap-2 sm:gap-4">
          <div className="flex flex-col items-center min-w-[50px] sm:min-w-[68px]">
            <span className="font-[family-name:var(--font-tech)] text-2xl sm:text-3xl font-bold tracking-tight text-white leading-none">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="font-[family-name:var(--font-kode)] text-[9px] sm:text-[10px] tracking-[0.25em] text-[#00b4d8] font-semibold mt-1">
              {unit.label}
            </span>
          </div>
          {idx < units.length - 1 && (
            <span className="font-[family-name:var(--font-tech)] text-zinc-600 text-xl font-bold -mt-3 select-none">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
