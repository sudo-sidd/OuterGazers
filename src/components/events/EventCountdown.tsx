"use client";

import { Fragment, useEffect, useState } from "react";

interface CountdownProps {
  targetDate?: string;
}

export default function EventCountdown({ targetDate = "2026-10-27T10:00:00+05:30" }: CountdownProps) {
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
    { label: "HRS", value: timeLeft.hours },
    { label: "MIN", value: timeLeft.minutes },
    { label: "SEC", value: timeLeft.seconds },
  ];

  return (
    <div className="w-full p-3 bg-black/60 border border-zinc-800 rounded-lg backdrop-blur-md">
      <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center gap-0">
        {units.map((unit, idx) => (
          <Fragment key={unit.label}>
            {/* Unit cell */}
            <div className="flex flex-col items-center">
              <span className="font-sans text-2xl font-bold tracking-tight text-white leading-none tabular-nums">
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className="font-sans text-[9px] tracking-[0.2em] text-[#00b4d8] font-semibold mt-1 uppercase">
                {unit.label}
              </span>
            </div>
            {/* Colon separator */}
            {idx < units.length - 1 && (
              <span
                className="text-zinc-600 text-lg font-bold -mt-4 select-none px-0.5 text-center"
              >
                :
              </span>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
