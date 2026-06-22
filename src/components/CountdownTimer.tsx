import { useEffect, useState } from 'react';

function TimerBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-2 w-10 sm:w-16 relative overflow-hidden">
      <span className="text-lg sm:text-xl font-extrabold text-white relative z-10 tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px] sm:text-xs uppercase font-medium text-white/90 tracking-wider relative z-10">
        {label}
      </span>
    </div>
  );
}

function calculateTimeLeft(endDate: string) {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownTimer({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(endDate));

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft(endDate)), 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  if (!timeLeft) {
    return (
      <span className="text-red-100 font-bold px-4 py-2 bg-red-500/30 rounded-full flex items-center text-sm">
        <span className="w-2 h-2 bg-red-300 rounded-full mr-2 animate-ping" />
        Expired
      </span>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#01843f] to-[#01a04d] text-white p-4 rounded-2xl shadow-lg flex flex-col items-center w-full lg:w-56 shrink-0">
      <h3 className="text-white text-sm font-bold mb-3 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        REMAINING TIME
      </h3>
      <div className="flex gap-2 sm:gap-3">
        <TimerBox value={timeLeft.days} label="Days" />
        <TimerBox value={timeLeft.hours} label="Hours" />
        <TimerBox value={timeLeft.minutes} label="Min" />
        <TimerBox value={timeLeft.seconds} label="Sec" />
      </div>
    </div>
  );
}
