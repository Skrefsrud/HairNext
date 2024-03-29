import { useState, useEffect } from "react";
import { fetchEmployees } from "@/pages/actions/employees/fetchEmployees";
import { SelectEmployee } from "../selectEmployee";
import { Button } from "../ui/button";
import { populateTimeSlots } from "../../pages/actions/timeSlots/populateTimeSlots";
import { Clock } from "../Clock";

type Employee = {
  id: number;
  first_name: string;
  surname: string;
  mobile: string;
  email: string;
  role: string;
};

export default function Availabilities() {
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
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

  return (
    <>
      <Clock></Clock>
      {/* <div className='flex gap-5 m-10'>
        {employees.map((employee) => (
          <div key={employee.id}>
            <SelectEmployee
              employee={employee}
              onSelect={handleEmployeeSelect}
            />
          </div>
        ))}
      </div> <Button onClick={populate}>Populate timeSlots</Button> */}
    </>
  );
}
