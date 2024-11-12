// BookingSystemComponent.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ServicesSelector from "./bookingComponents/ServiceSelector";
import { WeekCalendar } from "./bookingComponents/week-calendar/WeekCalendar";
import { EmployeeSelection } from "./bookingComponents/EmployeeSelection";
import BookingSummary from "./bookingComponents/BookingSummary";
import { Service, Employee } from "@/utils/interfaces";
import { fetchEmployees } from "@/pages/actions/employees/fetchEmployees";

export default function BookingSystemComponent() {
  const [stage, setStage] = useState(1);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [combinedPrice, setCombinedPrice] = useState<number>(0);
  const [combinedDuration, setCombinedDuration] = useState<number>(0);
  const [selectedDateTimes, setSelectedDateTimes] = useState<Date[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState<boolean>(true);
  const [employeesError, setEmployeesError] = useState<string | null>(null);

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const data = await fetchEmployees();
        setEmployees(data);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setEmployeesError("Failed to load employees");
      } finally {
        setLoadingEmployees(false);
      }
    };

    getEmployees();
  }, []);

  const handleNext = () => {
    setStage(2);
  };

  const handleBack = () => {
    setStage(1);
  };

  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleSelectTimeSlots = (dateTimes: Date[]) => {
    setSelectedDateTimes(dateTimes);
  };

  const handleServicesSubmit = useCallback(
    (
      selectedServices: Service[],
      combinedPrice: number,
      combinedDuration: number
    ) => {
      setSelectedServices(selectedServices);
      setCombinedPrice(combinedPrice);
      setCombinedDuration(combinedDuration);
    },
    [] // Dependencies; if you use any state variables inside, include them here
  );

  const handleConfirmBooking = () => {
    console.log("Booking confirmed with the following details:");
    console.log("Services:", selectedServices);
    console.log("Total Price:", combinedPrice);
    console.log("Total Duration:", combinedDuration);
    console.log("Selected Employee:", selectedEmployee);
    console.log("Selected Time Slots:", selectedDateTimes);
    // Implement booking confirmation logic here
  };

  return (
    <div className="container mx-auto p-4 ">
      <Card className="w-full max-w-4xl mx-auto bg-slate-100">
        <CardHeader>
          <CardTitle>Book an Appointment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  {stage === 1 ? (
                    <ServicesSelector onServicesSubmit={handleServicesSubmit} />
                  ) : (
                    <WeekCalendar
                      employeeId={selectedEmployee?.id}
                      duration={combinedDuration / 15}
                      onSelectTimeSlots={handleSelectTimeSlots}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Select Employee</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingEmployees ? (
                    <p>Loading employees...</p>
                  ) : employeesError ? (
                    <p>{employeesError}</p>
                  ) : (
                    <EmployeeSelection
                      employees={employees}
                      selectedEmployee={selectedEmployee}
                      onSelect={handleEmployeeSelect}
                    />
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <BookingSummary
                    selectedServices={selectedServices}
                    combinedPrice={combinedPrice}
                    combinedDuration={combinedDuration}
                    selectedDateTimes={selectedDateTimes}
                    selectedEmployee={selectedEmployee}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {stage === 2 && (
            <Button onClick={handleBack} variant="outline">
              Back
            </Button>
          )}
          <Button
            onClick={stage === 1 ? handleNext : handleConfirmBooking}
            className="ml-auto"
            disabled={
              (stage === 1 && selectedServices.length === 0) ||
              (stage === 2 && selectedDateTimes.length === 0)
            }
          >
            {stage === 1 ? "Next" : "Confirm Booking"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
