import { WeekCalendar } from "../bookingComponents/week-calendar/WeekCalendar";
import { SelectEmployee } from "../selectEmployee";
import { useState, useEffect } from "react";
import { fetchEmployees } from "@/pages/actions/employees/fetchEmployees";
import { Employee } from "@/utils/interfaces";

export const Dashboard = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<number[]>([]);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const fetchedEmployees = await fetchEmployees();
        if (!fetchedEmployees) {
          throw new Error("employees were null");
        }
        console.log("fetchedEmployees", fetchedEmployees);

        setEmployees(fetchedEmployees);
      } catch (err) {
        if (!err.message) {
        }
      }
    };

    loadEmployees();
  }, []);

  const handleEmployeeSelect = (employee: Employee) => {
    if (employee == selectedEmployee) {
      setSelectedEmployee(null);
      return;
    }
    setSelectedEmployee(employee);
  };

  const handleSelectTimeSlots = (timeSlots: number[]) => {
    console.log("Selected Time Slots:", timeSlots);
    setSelectedTimeSlots(timeSlots);
  };

  return (
    <div className="relative w-full h-full">
      <div className="flex justify-center items-center align-center gap-2 ">
        {employees.map((employee) => (
          <SelectEmployee
            key={employee.id}
            employee={employee}
            clickable={true}
            checkMark={false}
            onSelect={handleEmployeeSelect}
            selected={selectedEmployee?.id === employee.id}
            dimmed={!!selectedEmployee && selectedEmployee?.id !== employee.id}
          />
        ))}
      </div>

      <WeekCalendar
        employeeId={selectedEmployee?.id}
        duration={2}
        onSelectTimeSlots={handleSelectTimeSlots}
      ></WeekCalendar>
    </div>
  );
};
