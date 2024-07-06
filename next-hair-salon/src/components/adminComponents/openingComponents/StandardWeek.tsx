import React from "react";

const StandardWeek = ({ hours, setHours }) => {
  const handleTimeChange = (id, type, value) => {
    setHours(
      hours.map((day) => (day.id === id ? { ...day, [type]: value } : day))
    );
  };

  const handleClosedChange = (id, value) => {
    setHours(
      hours.map((day) =>
        day.id === id
          ? {
              ...day,
              is_closed: value,
              ...(value && { opening_time: "00:00", closing_time: "00:00" }),
            }
          : day
      )
    );
  };

  return (
    <div>
      {hours.map((day) => (
        <div key={day.id} className='flex items-center gap-4 mb-2'>
          <label className='w-24'>{day.day_of_week}</label>
          <input
            type='time'
            value={day.opening_time}
            disabled={day.is_closed}
            onChange={(e) =>
              handleTimeChange(day.id, "opening_time", e.target.value)
            }
            className='border p-1'
          />
          <span>-</span>
          <input
            type='time'
            value={day.closing_time}
            disabled={day.is_closed}
            onChange={(e) =>
              handleTimeChange(day.id, "closing_time", e.target.value)
            }
            className='border p-1'
          />
          <label>
            <input
              type='checkbox'
              checked={day.is_closed}
              onChange={(e) => handleClosedChange(day.id, e.target.checked)}
              className='ml-2'
            />
            Closed
          </label>
        </div>
      ))}
    </div>
  );
};

export default StandardWeek;
