import { useState, useEffect } from "react";
import { fetchEmployees } from "@/pages/actions/employees/fetchEmployees";
import { SelectEmployee } from "../selectEmployee";
import { Button } from "../ui/button";
import { populateTimeSlots } from "../../pages/actions/timeSlots/populateTimeSlots";
import { fetchEmployeeData } from "@/pages/actions/employees/fetchEmployeeData";
import EmployeeCalendar from "./employeeComponents/EmployeeCalendar";

type EmployeeType = {
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

  useEffect(() => {
    const loadEmployeeData = async () => {
      try {
        const fetchedEmployees = await fetchEmployees();
        if (!fetchedEmployees) {
          throw new Error("employees were null");
        }

        console.log(fetchedEmployees);
        setEmployees(fetchedEmployees);

        // Chain employee data fetching
      } catch (err) {
        if (!err.message) {
          throw new Error("error didn't have a message");
        }
        setError(err.message);
      }
    };

    loadEmployeeData();
  }, []);

  return (
    <div>
      <EmployeeCalendar passedEmployees={employees} />
    </div>
  );
}
