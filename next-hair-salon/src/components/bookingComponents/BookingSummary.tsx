// BookingSummary.tsx
import React from "react";
import { Service, Employee } from "@/utils/interfaces";

interface BookingSummaryProps {
  selectedServices: Service[];
  combinedPrice: number;
  combinedDuration: number;
  selectedDateTimes: Date[];
  selectedEmployee: Employee | null;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  selectedServices,
  combinedPrice,
  combinedDuration,
  selectedDateTimes,
  selectedEmployee,
}) => {
  // Function to format combined duration to "HH:mm"
  const formatDuration = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div>
      <h3>Booking Summary</h3>
      <div>
        <strong>Selected Services:</strong>
        <ul>
          {selectedServices.map((service) => (
            <li key={service.id}>{service.name}</li>
          ))}
        </ul>
      </div>
      <div>
        <strong>Total Price:</strong> ${combinedPrice}
      </div>
      <div>
        <strong>Total Duration:</strong> {formatDuration(combinedDuration)}
      </div>
      <div>
        <strong>Selected Employee:</strong>{" "}
        {selectedEmployee ? selectedEmployee.name : "Any"}
      </div>
      <div>
        <strong>Selected Time Slots:</strong>
        {selectedDateTimes.length > 0 ? (
          <ul>
            {selectedDateTimes.map((dateTime, index) => (
              <li key={index}>
                {dateTime.toLocaleString("en-US", {
                  dateStyle: "full",
                  timeStyle: "short",
                })}
              </li>
            ))}
          </ul>
        ) : (
          <p>No time slots selected.</p>
        )}
      </div>
    </div>
  );
};

export default BookingSummary;
