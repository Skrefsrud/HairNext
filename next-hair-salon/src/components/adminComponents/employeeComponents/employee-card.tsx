import Image from "next/image";
import image from "../../../../public/floatingImages/floating6.jpg";
import { Button } from "@/components/ui/button";
import { PenIcon } from "@/components/ui/pen-icon";

interface Employee {
  id: number;
  first_name: string;
  surname: string;
  mobile: string;
  email: string;
  role: string;
}

export const EmployeeCard: React.FC<{ employee: Employee }> = ({
  employee,
}) => {
  const { id, first_name, surname, email, mobile, role } = employee;
  return (
    <div className='card w-96  image-full  bg-indigo-500 shadow-lg shadow-indigo-500/50 hover:shadow-indigo-500/70'>
      <figure>
        <Image src={image} alt={`Employee: ${first_name} ${surname}`}></Image>
      </figure>
      <div className='card-body'>
        <h2 className='card-title font-poppins font-extralight text-white text-4xl '>
          {first_name} {surname}
        </h2>
        <div className='flex flex-col flex-1 gap-4 justify-center'>
          <div className=''>
            <div className='flex flex-col justify-center'>
              <p className='text-lg'>Email:</p>
              <p>{email}</p>
            </div>
          </div>
          <div className=''>
            <div className='flex flex-col justify-center'>
              <p className='text-lg font-poppins'>Mobile:</p>
              <p>{mobile}</p>
            </div>
          </div>
          <div className=''>
            <div className='flex flex-col justify-center'>
              <p className='text-lg'>Role:</p>
              <p>{role}</p>
            </div>
          </div>
        </div>

        <div className='card-actions justify-between'>
          <PenIcon
            className='h-6 w-6 hover:cursor-pointer'
            onClick={() => {
              console.log("edit");
            }}
          ></PenIcon>
          <Button>See availabilites</Button>
        </div>
      </div>
    </div>
  );
};
