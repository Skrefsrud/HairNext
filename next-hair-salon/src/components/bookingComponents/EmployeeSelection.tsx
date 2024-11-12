// EmployeeSelection.tsx
import React from "react";
import { Employee } from "@/utils/interfaces";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface EmployeeSelectionProps {
  employees: Employee[];
  selectedEmployee: Employee | null;
  onSelect: (employee: Employee) => void; // Ensure employee is non-null
}

export const EmployeeSelection: React.FC<EmployeeSelectionProps> = ({
  employees,
  selectedEmployee,
  onSelect,
}) => {
  const handleSelect = (employee: Employee) => {
    if (selectedEmployee?.id === employee.id) {
      onSelect(employee); // Pass the employee object for deselection
    } else {
      onSelect(employee);
    }
  };

  return (
    <div className="space-y-2">
      {employees.map((employee) => (
        <Button
          key={employee.id}
          onClick={() => handleSelect(employee)}
          variant={
            selectedEmployee?.id === employee.id ? "secondary" : "outline"
          }
          className="flex items-center w-full justify-start"
        >
          <Avatar className="mr-3">
            <AvatarImage
              src={employee.avatarUrl || "/placeholder.svg"}
              alt={`${employee.first_name} ${employee.surname}`}
            />
            <AvatarFallback>
              {employee.first_name.charAt(0)}
              {employee.surname.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span>
            {employee.first_name} {employee.surname}
          </span>
        </Button>
      ))}
    </div>
  );
};
