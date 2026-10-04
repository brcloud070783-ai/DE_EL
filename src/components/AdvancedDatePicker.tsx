import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  Sparkles,
  CalendarDays,
} from 'lucide-react';

const INDONESIAN_MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const SHORT_DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export function parseIndonesianDate(str: string): Date | null {
  if (!str) return null;
  const cleanStr = str.replace(/[;,]/g, '').trim();

  // Try YYYY-MM-DD
  const isoMatch = cleanStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    return new Date(parseInt(isoMatch[1]), parseInt(isoMatch[2], 10) - 1, parseInt(isoMatch[3], 10));
  }

  // Try "DD Month YYYY"
  const parts = cleanStr.split(/\s+/);
  if (parts.length >= 3) {
    const day = parseInt(parts[0], 10);
    const monthName = parts[1].toLowerCase();
    const year = parseInt(parts[2], 10);

    const monthIndex = INDONESIAN_MONTHS.findIndex(
      (m) => m.toLowerCase() === monthName
    );

    if (!isNaN(day) && monthIndex !== -1 && !isNaN(year)) {
      return new Date(year, monthIndex, day);
    }
  }

  return null;
}

export function formatToIndonesianDate(date: Date): string {
  const day = date.getDate();
  const monthName = INDONESIAN_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${monthName} ${year}`;
}

export function formatToIsoString(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

interface AdvancedDatePickerProps {
  label?: string;
  value: string;
  onChange: (formattedIndonesianDate: string, dateObj?: Date) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  helperText?: string;
}

export const AdvancedDatePicker: React.FC<AdvancedDatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Pilih atau ketik tanggal...',
  icon,
  className = '',
  helperText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parsed current value or today
  const parsedValue = parseIndonesianDate(value);
  const initialViewDate = parsedValue || new Date();

  const [viewYear, setViewYear] = useState(initialViewDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialViewDate.getMonth());

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update calendar view when value changes from external
  useEffect(() => {
    if (parsedValue) {
      setViewYear(parsedValue.getFullYear());
      setViewMonth(parsedValue.getMonth());
    }
  }, [value]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const selectedDate = new Date(viewYear, viewMonth, day);
    const formatted = formatToIndonesianDate(selectedDate);
    onChange(formatted, selectedDate);
    setIsOpen(false);
  };

  const handlePreset = (daysOffset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    const formatted = formatToIndonesianDate(date);
    onChange(formatted, date);
    setViewYear(date.getFullYear());
    setViewMonth(date.getMonth());
    setIsOpen(false);
  };

  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value; // YYYY-MM-DD
    if (!rawVal) return;
    const parts = rawVal.split('-');
    if (parts.length === 3) {
      const selectedDate = new Date(
        parseInt(parts[0], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[2], 10)
      );
      const formatted = formatToIndonesianDate(selectedDate);
      onChange(formatted, selectedDate);
    }
  };

  // Calendar generation logic
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun

  const today = new Date();
  const isTodaySelected =
    parsedValue &&
    parsedValue.getDate() === today.getDate() &&
    parsedValue.getMonth() === today.getMonth() &&
    parsedValue.getFullYear() === today.getFullYear();

  const isoValue = parsedValue ? formatToIsoString(parsedValue) : '';

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
          {icon || <CalendarIcon className="w-3.5 h-3.5 text-emerald-600" />}
          <span>{label}</span>
        </label>
      )}

      {/* Input Group */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-3 pr-11 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white shadow-xs transition"
        />

        <div className="absolute right-1.5 flex items-center">
          {/* Single Interactive Popover Toggle Button */}
          <button
            type="button"
            onClick={() => {
              if (!isOpen && parsedValue) {
                setViewYear(parsedValue.getFullYear());
                setViewMonth(parsedValue.getMonth());
              }
              setIsOpen(!isOpen);
            }}
            className={`p-1.5 rounded-lg border transition text-xs flex items-center justify-center ${
              isOpen
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}
            title="Buka Kalender"
          >
            <CalendarIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {helperText && <p className="text-[10px] text-slate-400 mt-1">{helperText}</p>}

      {/* Interactive Calendar Popover */}
      {isOpen && (
        <div className="absolute left-0 sm:right-0 sm:left-auto mt-1.5 w-72 sm:w-80 bg-white border border-slate-200/90 rounded-2xl shadow-2xl z-50 p-3.5 animate-in fade-in zoom-in-95 duration-150">
          {/* Popover Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-800">Kalender Interaktif</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Month & Year Navigation */}
          <div className="flex items-center justify-between my-2.5 px-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(parseInt(e.target.value, 10))}
                className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                {INDONESIAN_MONTHS.map((m, idx) => (
                  <option key={m} value={idx}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                value={viewYear}
                onChange={(e) => setViewYear(parseInt(e.target.value, 10))}
                className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                {Array.from({ length: 16 }, (_, i) => 2020 + i).map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {SHORT_DAYS.map((d, idx) => (
              <span
                key={d}
                className={`text-[10px] font-bold uppercase py-1 ${
                  idx === 0 ? 'text-rose-500' : 'text-slate-400'
                }`}
              >
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="h-8" />
            ))}

            {/* Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected =
                parsedValue &&
                parsedValue.getDate() === day &&
                parsedValue.getMonth() === viewMonth &&
                parsedValue.getFullYear() === viewYear;

              const isToday =
                today.getDate() === day &&
                today.getMonth() === viewMonth &&
                today.getFullYear() === viewYear;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`h-8 rounded-lg text-xs font-medium transition flex items-center justify-center relative ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : isToday
                      ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-300'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {day}
                  {isToday && !isSelected && (
                    <span className="absolute bottom-1 w-1 h-1 bg-emerald-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Presets Bar */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 text-[10px] font-medium flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" /> Cepat:
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handlePreset(0)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 text-slate-600 font-medium transition"
                >
                  Hari Ini
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset(1)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 text-slate-600 font-medium transition"
                >
                  Besok
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset(3)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 text-slate-600 font-medium transition"
                >
                  +3 Hari
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset(7)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 text-slate-600 font-medium transition"
                >
                  +7 Hari
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100/80 text-[10px]">
              <div className="relative flex items-center text-slate-500 hover:text-emerald-700 font-medium cursor-pointer">
                <input
                  type="date"
                  value={isoValue}
                  onChange={(e) => {
                    handleNativeChange(e);
                    setIsOpen(false);
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />
                <span className="flex items-center gap-1 text-emerald-700 hover:underline">
                  <CalendarDays className="w-3 h-3 text-emerald-600" /> Gunakan Date Picker HP / System
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
