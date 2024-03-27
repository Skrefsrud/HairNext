import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";
import { EmployeeCard } from "./employeeComponents/employee-card";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase.from("employee").select("*");

        if (error) throw error;

        setEmployees(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {isLoading && <p>Loading employees...</p>}
      {error && <p>Error loading employees: {error}</p>}

      {!isLoading && !error && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-10 '>
          {employees.map((employee) => (
            <div key={employee.id} className='flex justify-center'>
              <EmployeeCard employee={employee} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Employees;
