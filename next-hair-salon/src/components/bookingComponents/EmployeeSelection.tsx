// EmployeeSelection.tsx
import React from "react";
import { Employee } from "@/utils/interfaces";

interface EmployeeSelectionProps {
  employees: Employee[];
  selectedEmployee: Employee | null;
  onSelect: (employee: Employee) => void;
}

export const EmployeeSelection: React.FC<EmployeeSelectionProps> = ({
  employees,
  selectedEmployee,
  onSelect,
}) => {
  return (
    <div className="space-y-2">
      {employees.map((employee) => (
        <button
          key={employee.id}
          onClick={() => onSelect(employee)}
          className={`flex items-center p-2 w-full text-left border rounded ${
            selectedEmployee?.id === employee.id ? "bg-blue-100" : ""
          }`}
        >
          <img
            src="/placeholder.svg?height=50&width=50" // Use a default avatar
            alt={`${employee.first_name} ${employee.surname}`}
            className="w-10 h-10 rounded-full mr-3"
          />
          <span>
            {employee.first_name} {employee.surname}
          </span>
        </button>
      ))}
    </div>
  );
};
