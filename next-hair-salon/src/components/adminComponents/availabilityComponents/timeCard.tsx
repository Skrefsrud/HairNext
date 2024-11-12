import { PenIcon } from "@/components/ui/pen-icon";
import { TimeInput } from "./timeInput";
import { useEffect, useState } from "react";
import { CheckMark } from "@/components/ui/icons/checkMark";

interface TimeCardProps {
  originalStartTime: string;
  originalEndTime: string;
  onSave: (startTime: string, endTime: string) => void;
}

export const TimeCard = ({
  originalStartTime,
  originalEndTime,
  onSave,
}: TimeCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [startTime, setStartTime] = useState(originalStartTime);
  const [endTime, setEndTime] = useState(originalEndTime);

  const handleSaveEdit = () => {
    onSave(startTime, endTime);
    setIsEditing(false);
  };

  return (
    <div className='flex flex-col gap-2'>
      {isEditing ? (
        <div className='grid grid-rows-subgrid'>
          <button
            className='flex justify-end content-end row-span-1'
            onClick={() => handleSaveEdit()}
          >
            <CheckMark />
          </button>
          <div className='flex flex-col gap-4'>
            <TimeInput
              label={"Start"}
              onChangeTime={(newTime) => setStartTime(newTime)}
            ></TimeInput>
            <TimeInput
              label={"End"}
              onChangeTime={(newTime) => setEndTime(newTime)}
            ></TimeInput>
          </div>
        </div>
      ) : (
        <div className='grid grid-rows-subgrid gap-4'>
          <button
            className='flex justify-end content-end row-span-1'
            onClick={() => setIsEditing(true)}
          >
            <PenIcon />
          </button>
          <h2 className='text-2xl'>
            {startTime} - {endTime}
          </h2>
        </div>
      )}
    </div>
  );
};
