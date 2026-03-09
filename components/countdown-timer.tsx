"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

type Props = {
  day: number;
  month: number; // 1-12
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getBirthdayDate(day: number, month: number) {
  const now = new Date();
  return new Date(now.getFullYear(), month - 1, day);
}

function getTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now());

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownCard({ day, month }: Props) {
  const [mounted, setMounted] = useState(false);

  const birthday = getBirthdayDate(day, month);
  const today = new Date();

  const isToday =
    today.getDate() === day && today.getMonth() === month - 1;

  const isPast = today > birthday && !isToday;

  const [time, setTime] = useState<TimeLeft>(() =>
    getTimeLeft(birthday)
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isPast || isToday) return;

    const interval = setInterval(() => {
      setTime(getTimeLeft(birthday));
    }, 1000);

    return () => clearInterval(interval);
  }, [birthday, isPast, isToday]);

  if (!mounted) return null;
  if (isToday) {
    return (
      <div className="text-center text-2xl font-semibold">
        🎉 Happy Birthday!
      </div>
    );
  }

  if (isPast) {
    return (
      <div className="text-center text-muted-foreground">
        Sudah ulang tahun
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 text-center">
      <TimeItem value={time.days} label="Hari" />
      <TimeItem value={time.hours} label="Jam" />
      <TimeItem value={time.minutes} label="Menit" />
      <TimeItem value={time.seconds} label="Detik" />
    </div>
  );
}

type TimeItemProps = {
  value: number;
  label: string;
};

function TimeItem({ value, label }: TimeItemProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-12 w-full overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex items-center justify-center text-3xl font-mono font-semibold tabular-nums"
          >
            {String(value).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
      </div>

      <span className="text-xs text-muted-foreground mt-1">
        {label}
      </span>
    </div>
  );
}