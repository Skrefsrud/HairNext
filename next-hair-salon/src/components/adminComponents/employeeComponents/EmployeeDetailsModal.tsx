import { useEffect } from "react";
import { CloseIcon } from "@/components/ui/icons/closeIcon";
import EmployeeCalendar from "./EmployeeCalendar";
type Employee = {
  id: number;
  first_name: string;
  surname: string;
  mobile: string;
  email: string;
  role: string;
};

export const EmployeeDetailsModal = ({ employee, onClose }) => {
  console.log(employee);
  // If you need to handle Escape key to close from within the modal:
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Ensure employee data exists
  if (!employee) {
    return <div className='modal-content'>Something went wrong...</div>;
  }

  return (
    <div className='fixed rounded-t-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-violet-400  shadow-xl z-50 '>
      {/* Overlay for clicking outside to close */}

      {/* Modal container */}
      <div className='modal-content bg-white p-6 rounded-lg relative flex justify-between'>
        {/* Close button */}

        {/* Modal Header */}
        <h2 className='text-lg font-bold'>
          {(employee.first_name + " " + employee.surname).toUpperCase()}
        </h2>
        <button className='' onClick={onClose}>
          <CloseIcon />
        </button>
      </div>

      <div className='grid grid-cols-3'>
        <div className='col-span-2'>something else</div>
        <div className='bg-red-300'>
          <EmployeeCalendar />
        </div>
      </div>
    </div>
  );
};
