import { useState, useEffect } from "react";
import { EmployeeCard } from "./employeeComponents/employee-card";
import { fetchEmployees } from "@/pages/actions/employees/fetchEmployees";
import { EmployeeDetailsModal } from "./employeeComponents/EmployeeDetailsModal";

type Employee = {
  id: number;
  first_name: string;
  surname: string;
  mobile: string;
  email: string;
  role: string;
};

function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

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

  const handleOpenModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedEmployee(null);
    setIsModalOpen(false);
  };

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
                <EmployeeCard
                  employee={employee}
                  onDetailsClick={() => handleOpenModal(employee)}
                />
              </div>
            );
          })}
        </div>
      )}
      {isModalOpen && (
        <>
          <EmployeeDetailsModal
            employee={selectedEmployee}
            onClose={handleCloseModal}
          />
          <div className='modal fixed inset-0 bg-gray-800 opacity-70 blur-lg z-30'></div>
        </>
      )}
    </div>
  );
}

export default Employees;
