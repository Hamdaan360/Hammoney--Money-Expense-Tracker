import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';

// --- DONUT / RING CHART FOR POCKET MONEY KHARCHA ---
interface DonutSlice {
  label: string;
  value: number;
  color: string;
  id: string;
}

interface DonutChartProps {
  data: DonutSlice[];
  size?: number;
  thickness?: number;
  centerTitle?: string;
  centerSubtitle?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 230,
  thickness = 32,
  centerTitle,
  centerSubtitle,
}) => {
  const { formatRupee } = useFinance();
  const [activeSlice, setActiveSlice] = useState<DonutSlice | null>(null);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-slate-400 text-xs">
        Is mahine koi kharcha record nahi hua
      </div>
    );
  }

  const radius = size / 2;
  const circumference = 2 * Math.PI * (radius - thickness / 2);
  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle
            cx={radius}
            cy={radius}
            r={radius - thickness / 2}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth={thickness}
          />
          {data.map((slice) => {
            const percent = slice.value / total;
            const strokeDasharray = `${percent * circumference} ${circumference}`;
            const strokeDashoffset = -accumulatedPercent * circumference;
            accumulatedPercent += percent;

            const isHovered = activeSlice?.id === slice.id;

            return (
              <circle
                key={slice.id}
                cx={radius}
                cy={radius}
                r={radius - thickness / 2}
                fill="none"
                stroke={slice.color}
                strokeWidth={isHovered ? thickness + 4 : thickness}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setActiveSlice(slice)}
                onMouseLeave={() => setActiveSlice(null)}
              />
            );
          })}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
            {activeSlice ? activeSlice.label : (centerSubtitle || 'Total Kharcha')}
          </span>
          <span className="text-xl font-bold text-slate-900 tabular-nums">
            {activeSlice ? formatRupee(activeSlice.value) : (centerTitle || formatRupee(total))}
          </span>
          {activeSlice && (
            <span className="text-[11px] text-slate-500 font-mono tabular-nums">
              {((activeSlice.value / total) * 100).toFixed(0)}% of total
            </span>
          )}
        </div>
      </div>

      {/* Legend Grid */}
      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 w-full text-xs">
        {data.slice(0, 6).map((item) => (
          <div
            key={item.id}
            onMouseEnter={() => setActiveSlice(item)}
            onMouseLeave={() => setActiveSlice(null)}
            className={`flex items-center justify-between p-1.5 rounded transition-colors cursor-pointer ${
              activeSlice?.id === item.id ? 'bg-slate-100 font-medium' : 'hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="truncate text-slate-700">{item.label}</span>
            </div>
            <span className="font-mono tabular-nums text-slate-900 shrink-0 ml-1.5">
              {formatRupee(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- DUAL BAR CHART: POCKET MONEY RECEIVED VS KHARCHA ---
interface TrendDataPoint {
  period: string; // e.g. "Aug", "Sep", "Oct"
  income: number;
  expense: number;
}

export const IncomeVsExpenseChart: React.FC<{ data: TrendDataPoint[]; height?: number }> = ({
  data,
  height = 190,
}) => {
  const { formatRupee } = useFinance();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxValue = Math.max(...data.flatMap((d) => [d.income, d.expense]), 1000);
  const chartHeight = height - 36;

  return (
    <div className="w-full flex flex-col">
      <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-600 inline-block" />
            <span>Money Received (Aaye)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-500 inline-block" />
            <span>Kharcha (Gaye)</span>
          </div>
        </div>
        {hoveredIndex !== null && data[hoveredIndex] && (
          <div className="font-mono tabular-nums text-slate-700">
            {data[hoveredIndex].period}: In {formatRupee(data[hoveredIndex].income)} · Out {formatRupee(data[hoveredIndex].expense)}
          </div>
        )}
      </div>

      <div className="relative w-full" style={{ height }}>
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
          <div className="border-b border-dashed border-slate-200 w-full" />
          <div className="border-b border-dashed border-slate-200 w-full" />
          <div className="border-b border-dashed border-slate-200 w-full" />
        </div>

        <div className="absolute inset-0 flex items-end justify-between gap-3 pt-4 pb-6 px-3">
          {data.map((item, idx) => {
            const incHeight = (item.income / maxValue) * chartHeight;
            const expHeight = (item.expense / maxValue) * chartHeight;
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={item.period}
                className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="w-full flex items-end justify-center gap-2 h-full">
                  <div
                    style={{ height: `${Math.max(4, incHeight)}px` }}
                    className={`w-4 sm:w-6 rounded-t transition-all ${
                      isHovered ? 'bg-emerald-500' : 'bg-emerald-600'
                    }`}
                  />
                  <div
                    style={{ height: `${Math.max(4, expHeight)}px` }}
                    className={`w-4 sm:w-6 rounded-t transition-all ${
                      isHovered ? 'bg-rose-400' : 'bg-rose-500'
                    }`}
                  />
                </div>
                <span
                  className={`mt-2 text-xs font-medium truncate ${
                    isHovered ? 'text-slate-900 font-bold' : 'text-slate-500'
                  }`}
                >
                  {item.period}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// --- 7-DAY WEEKLY BURN CHART ---
interface DaySpendPoint {
  dayName: string;
  dateStr: string;
  amount: number;
  isToday?: boolean;
}

export const WeeklyBurnChart: React.FC<{
  days: DaySpendPoint[];
  dailyBudget?: number;
  height?: number;
}> = ({ days, dailyBudget = 150, height = 180 }) => {
  const { formatRupee } = useFinance();
  const [hoveredDay, setHoveredDay] = useState<DaySpendPoint | null>(null);

  const maxSpend = Math.max(...days.map((d) => d.amount), dailyBudget * 1.3, 100);
  const chartHeight = height - 36;
  const budgetLineY = chartHeight - (dailyBudget / maxSpend) * chartHeight;

  return (
    <div className="w-full flex flex-col">
      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-600 inline-block" />
            <span>Daily Kharcha</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 border-t border-dashed border-amber-500 inline-block" />
            <span>Daily Pocket Target ({formatRupee(dailyBudget)})</span>
          </span>
        </div>
        {hoveredDay && (
          <span className="font-mono tabular-nums text-slate-900 font-medium">
            {hoveredDay.dayName}: {formatRupee(hoveredDay.amount)}
          </span>
        )}
      </div>

      <div className="relative w-full" style={{ height }}>
        <div
          className="absolute left-0 right-0 border-b border-dashed border-amber-400 z-10 pointer-events-none"
          style={{ top: `${budgetLineY + 6}px` }}
        />

        <div className="absolute inset-0 flex items-end justify-between gap-2 pb-6 px-1">
          {days.map((day) => {
            const barHeight = (day.amount / maxSpend) * chartHeight;
            const isOver = day.amount > dailyBudget;
            const isHovered = hoveredDay?.dateStr === day.dateStr;

            return (
              <div
                key={day.dateStr}
                className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                <div className="relative w-full flex justify-center items-end h-full">
                  <div
                    style={{ height: `${Math.max(4, barHeight)}px` }}
                    className={`w-full max-w-[28px] rounded-t transition-all ${
                      isOver
                        ? isHovered ? 'bg-amber-500' : 'bg-amber-600'
                        : isHovered ? 'bg-emerald-500' : 'bg-emerald-600'
                    } ${day.isToday ? 'ring-2 ring-emerald-400 ring-offset-1' : ''}`}
                  />
                </div>
                <div className="mt-2 flex flex-col items-center">
                  <span
                    className={`text-xs ${
                      day.isToday
                        ? 'font-bold text-emerald-600'
                        : isHovered
                        ? 'text-slate-900 font-semibold'
                        : 'text-slate-500'
                    }`}
                  >
                    {day.dayName}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
