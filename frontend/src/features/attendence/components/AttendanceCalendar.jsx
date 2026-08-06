import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import { CalendarDayCell } from './CalendarDayCell';
import { Button } from '@/components/ui/Button';

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const LEGEND_ITEMS = [
  { label: 'Present', color: 'bg-success' },
  { label: 'Absent', color: 'bg-danger' },
  { label: 'Late', color: 'bg-warning' },
  { label: 'Leave', color: 'bg-warning' },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_RANGE = Array.from({ length: 20 }, (_, i) => CURRENT_YEAR - 5 + i);

export function AttendanceCalendar({ 
  currentMonth, 
  onMonthChange, 
  records, 
  selectedDate, 
  onDayClick, 
  onMarkAttendanceClick 
}) {
  const [openDropdown, setOpenDropdown] = useState(null);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  // SMART STATUS LOGIC: Majority Status Priority
  const statusByDate = useMemo(() => {
    const groupedByDate = {};

    // Step 1: Har date ke tamam status ikathay karein
    records.forEach((rec) => {
      if (!groupedByDate[rec.attendanceDate]) {
        groupedByDate[rec.attendanceDate] = [];
      }
      groupedByDate[rec.attendanceDate].push(rec.status);
    });

    const resultMap = {};

    // Step 2: Har date ke liye majority count calculate karein
    Object.keys(groupedByDate).forEach((dateKey) => {
      const statuses = groupedByDate[dateKey];
      const counts = { Present: 0, Absent: 0, Late: 0, Leave: 0, 'Half Day': 0, Holiday: 0 };

      statuses.forEach((st) => {
        if (counts[st] !== undefined) counts[st]++;
      });

      // Priority in case of tie: Absent > Late > Half Day > Leave > Present
      let dominantStatus = 'Present';
      let maxCount = -1;

      const priorityOrder = ['Absent', 'Late', 'Half Day', 'Leave', 'Holiday', 'Present'];

      priorityOrder.forEach((status) => {
        if (counts[status] > maxCount) {
          maxCount = counts[status];
          dominantStatus = status;
        }
      });

      resultMap[dateKey] = dominantStatus;
    });

    return resultMap;
  }, [records]);

  return (
    <div className="rounded-card border border-border bg-background p-6">
      
      {openDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setOpenDropdown(null)} 
        />
      )}

      {/* HEADER */}
      <div className="flex flex-col gap-5 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-text-primary whitespace-nowrap flex items-center gap-2">
              <CalendarDays size={20} className="text-primary" />
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            <p className="text-sm text-text-secondary mt-1 whitespace-nowrap">
              Your attendance overview
            </p>
          </div>
          <Button onClick={onMarkAttendanceClick} className="shrink-0 shadow-sm">
            + Mark Attendance
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border/50">
          
          <div className="flex items-center gap-1 bg-white/5 rounded-lg border border-border/60 p-1 w-fit shadow-sm relative z-50">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 hover:bg-white/10" 
              onClick={() => onMonthChange(subMonths(currentMonth, 1))} 
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </Button>
            
            <div className="flex items-center justify-center min-w-[110px] px-2 gap-1.5 relative">
              <div className="relative">
                <button 
                  onClick={() => setOpenDropdown(openDropdown === 'month' ? null : 'month')}
                  className={`text-sm font-semibold transition-colors outline-none px-1 py-0.5 rounded-md ${openDropdown === 'month' ? 'text-primary bg-primary/10' : 'text-text-primary hover:text-primary hover:bg-white/5'}`}
                >
                  {format(currentMonth, 'MMM')}
                </button>
                
                {openDropdown === 'month' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-background border border-border rounded-xl shadow-xl p-2 grid grid-cols-3 gap-1 z-50">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          onMonthChange(new Date(currentMonth.getFullYear(), i, 1));
                          setOpenDropdown(null);
                        }}
                        className={`px-2 py-2 text-xs font-medium rounded-lg transition-colors ${
                          currentMonth.getMonth() === i 
                            ? 'bg-primary text-white' 
                            : 'hover:bg-white/10 text-text-primary'
                        }`}
                      >
                        {format(new Date(2000, i, 1), 'MMM')}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button 
                  onClick={() => setOpenDropdown(openDropdown === 'year' ? null : 'year')}
                  className={`text-sm font-semibold transition-colors outline-none px-1 py-0.5 rounded-md ${openDropdown === 'year' ? 'text-primary bg-primary/10' : 'text-text-primary hover:text-primary hover:bg-white/5'}`}
                >
                  {currentMonth.getFullYear()}
                </button>
                
                {openDropdown === 'year' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-24 max-h-56 overflow-y-auto bg-background border border-border rounded-xl shadow-xl p-1 z-50 custom-scrollbar">
                    {YEAR_RANGE.map((year) => (
                      <button
                        key={year}
                        onClick={() => {
                          onMonthChange(new Date(year, currentMonth.getMonth(), 1));
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-center px-3 py-2 text-sm font-medium rounded-lg transition-colors mb-1 ${
                          currentMonth.getFullYear() === year 
                            ? 'bg-primary text-white' 
                            : 'hover:bg-white/10 text-text-primary'
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 hover:bg-white/10" 
              onClick={() => onMonthChange(addMonths(currentMonth, 1))} 
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {LEGEND_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
                <span className={`w-2.5 h-2.5 rounded-full ${item.color} shadow-sm`} />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CALENDAR GRID */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAY_LABELS.map((label, i) => (
          <div key={i} className="text-center text-xs font-bold text-text-secondary uppercase tracking-wider py-1">
            {label}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          return (
            <CalendarDayCell
              key={dateKey}
              date={day}
              status={statusByDate[dateKey] ?? null}
              isCurrentMonth={isSameMonth(day, currentMonth)}
              isSelected={selectedDate ? isSameDay(day, selectedDate) : false}
              onClick={() => onDayClick?.(day)}
            />
          );
        })}
      </div>
    </div>
  );
}

AttendanceCalendar.propTypes = {
  currentMonth: PropTypes.instanceOf(Date).isRequired,
  onMonthChange: PropTypes.func.isRequired,
  records: PropTypes.array.isRequired,
  selectedDate: PropTypes.instanceOf(Date),
  onDayClick: PropTypes.func,
  onMarkAttendanceClick: PropTypes.func,
};