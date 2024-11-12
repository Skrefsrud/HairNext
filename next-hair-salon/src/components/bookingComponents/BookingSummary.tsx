// BookingSummary.tsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
    <div className="space-y-4 flex flex-col">
      <div className="flex gap-4 w-full">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Price</CardTitle>
          </CardHeader>
          <CardContent>
            <p>kr {combinedPrice}</p>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{formatDuration(combinedDuration)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Selected Services</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedServices.length > 0 ? (
            <ul className="list-disc list-inside">
              {selectedServices.map((service) => (
                <li key={service.id}>{service.name}</li>
              ))}
            </ul>
          ) : (
            <p>No services selected.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Selected Employee</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{selectedEmployee ? selectedEmployee.first_name : "Any"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Valgt tidsperiode</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateTimes.length > 0 ? (
            <div>
              <p>
                <strong>Dato:</strong>{" "}
                {selectedDateTimes[0].toLocaleDateString("nb-NO", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p>
                <strong>Tid:</strong>{" "}
                {selectedDateTimes[0].toLocaleTimeString("nb-NO", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                -{" "}
                {selectedDateTimes[
                  selectedDateTimes.length - 1
                ].toLocaleTimeString("nb-NO", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ) : (
            <p>Ingen tidsluker valgt.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingSummary;
