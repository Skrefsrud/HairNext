import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckmarkIcon } from "./ui/icons/checkmarkIcon";
import { useState } from "react";
import { useSpring, animated, config } from "react-spring";

type Employee = {
  id: number;
  first_name: string;
  surname: string;
  mobile: string;
  email: string;
  role: string;
};

export const SelectEmployee = (props) => {
  const { employee, onSelect } = props;
  const [isChecked, setIsChecked] = useState(false);

  const handleSelect = () => {
    onSelect(employee);
    setIsChecked(!isChecked);
  };

  const name_first_letters = getFirstLetters(
    employee.first_name,
    employee.surname
  );

  function getFirstLetters(name, surname) {
    const first = name.charAt(0);
    const sur = surname.charAt(0);
    return first + sur;
  }

  const animatedProps = useSpring({
    opacity: isChecked ? 1 : 0,
    transform: isChecked
      ? "scale(1) rotate(0deg)"
      : "scale(0.8) rotate(-45deg)",
    config: config.wobbly,
  });

  return (
    <div
      className='flex flex-wrap w-24 h-24 relative cursor-pointer '
      onClick={handleSelect}
    >
      <div className='absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 bg-white rounded-full h-1/2 w-1/2 z-10'>
        {isChecked && (
          <animated.div style={animatedProps}>
            <CheckmarkIcon></CheckmarkIcon>
          </animated.div>
        )}
      </div>
      <Avatar className='h-full w-full' key={employee.id}>
        <AvatarImage src='https://github.com/shadcn.png' />
        <AvatarFallback>fallback</AvatarFallback>
      </Avatar>

      <p className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-poppins font-extrabold opacity-70 text-white text-5xl select-none'>
        {name_first_letters}
      </p>
    </div>
  );
};
