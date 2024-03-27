import { useState, useEffect } from "react";
import { EmployeeCard } from "./employeeComponents/employee-card";
import { fetchEmployees } from "@/pages/actions/employees/fetchEmployees";

function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEmployees = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    loadEmployees();
  }, []);

  return (
    <div>
      {isLoading && <p>Loading employees...</p>}
      {error && <p>Error loading employees: {error}</p>}

      {!isLoading && !error && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-10 '>
          {employees.map((employee) => {
            if (!employee) {
              throw new Error("employee was null");
            }
            return (
              <div key={employee.id} className='flex justify-center'>
                <EmployeeCard employee={employee} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Employees;
