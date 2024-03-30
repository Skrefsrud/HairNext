import { useState, useEffect } from "react";
import { fetchEmployees } from "@/pages/actions/employees/fetchEmployees";
import { SelectEmployee } from "../selectEmployee";
import { Button } from "../ui/button";
import { populateTimeSlots } from "../../pages/actions/timeSlots/populateTimeSlots";
import { Clock } from "../Clock";
import { TimeInput } from "./availabilityComponents/timeInput";
import { TimeCard } from "./availabilityComponents/timeCard";

type Employee = {
  id: number;
  first_name: string;
  surname: string;
  mobile: string;
  email: string;
  role: string;
};

export default function Availabilities() {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [employees, setEmployees] = useState<Employee[]>([]);

  const handleEmployeeSelect = (employee: Employee) => {
    const existingEmployeeIndex = selectedEmployees.findIndex(
      (selectedEmployee) => selectedEmployee.id === employee.id
    );

    existingEmployeeIndex === -1
      ? setSelectedEmployees([...selectedEmployees, employee])
      : setSelectedEmployees(
          selectedEmployees.filter((e) => e.id !== employee.id)
        );

    console.log(selectedEmployees);
  };

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const fetchedEmployees = await fetchEmployees();
        if (!fetchedEmployees) {
          throw new Error("employees were null");
        }

        setEmployees(fetchedEmployees);
      } catch (err) {
        if (!err.message) {
          throw new Error("error didn't have a message");
        }
        setError(err.message);
      }
    };

    loadEmployees();
  }, []);

  async function populate() {
    await populateTimeSlots(3, 2024);
  }

  const handleTimeEdit = async (
    startTime: string,
    endTime: string,
    employee: Employee,
    day: string
  ) => {
    console.log(startTime, endTime, employee, day);
  };

  return (
    <div className='container mx-auto flex justify-start w-full'>
      <div className='grid grid-cols-8 gap-4 w-full '>
        {employees.map((employee, index) => (
          <div
            key={index}
            className={`justify-items-center items-center mt-5  grid  col-start-1 col-span-9 grid-cols-subgrid row-start-${
              index + 2
            }`}
          >
            <SelectEmployee
              employee={employee}
              checkMark={false}
              clickable={false}
            ></SelectEmployee>
            {daysOfWeek.map((day) => (
              <div key={day} className='w-fill flex flex-col gap-2'>
                <TimeCard
                  originalStartTime={"09:00"}
                  originalEndTime={"17:00"}
                  onSave={(startTime, endTime) => {
                    handleTimeEdit(startTime, endTime, employee, day);
                  }}
                ></TimeCard>
              </div>
            ))}
          </div>
        ))}

        <div className='row-start-1 col-start-1 col-end-1'> </div>
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className={`bg-gray-100 p-2 text-center border row-start-1 `}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}
