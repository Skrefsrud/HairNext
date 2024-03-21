"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";

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
        <div>
          {employees.map((employee) => (
            <div key={employee.id}>
              <p>
                Name: {employee.first_name} {employee.surname}
              </p>
              <p>Email: {employee.email}</p>
              <p>Role: {employee.role}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Employees;
