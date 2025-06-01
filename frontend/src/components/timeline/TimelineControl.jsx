
import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export const TimelineControl = ({
  selectedDate,
  onDateChange,
  minYear,
  maxYear
}) => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const goToPrevious = () => {
    let newMonth = selectedDate.month - 1;
    let newYear = selectedDate.year;
    
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    
    if (newYear >= minYear) {
      onDateChange(newMonth, newYear);
    }
  };

  const goToNext = () => {
    let newMonth = selectedDate.month + 1;
    let newYear = selectedDate.year;
    
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    
    if (newYear <= maxYear) {
      onDateChange(newMonth, newYear);
    }
  };

  const canGoBack = !(selectedDate.year === minYear && selectedDate.month === 1);
  const canGoForward = !(selectedDate.year === maxYear && selectedDate.month === 12);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
      <div className="flex items-center space-x-3">
        <Calendar size={18} className="text-gray-600" />
        
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPrevious}
            disabled={!canGoBack}
            className={`p-1 rounded ${
              canGoBack 
                ? 'hover:bg-gray-100 text-gray-600 hover:text-gray-800' 
                : 'text-gray-300 cursor-not-allowed'
            }`}
            title="Previous month"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center space-x-2 min-w-24 justify-center">
            <select
              value={selectedDate.month}
              onChange={(e) => onDateChange(parseInt(e.target.value), selectedDate.year)}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              {months.map((month, index) => (
                <option key={month} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>

            <select
              value={selectedDate.year}
              onChange={(e) => onDateChange(selectedDate.month, parseInt(e.target.value))}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              {Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i).map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={goToNext}
            disabled={!canGoForward}
            className={`p-1 rounded ${
              canGoForward 
                ? 'hover:bg-gray-100 text-gray-600 hover:text-gray-800' 
                : 'text-gray-300 cursor-not-allowed'
            }`}
            title="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
