import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

interface TimeInputProps {
  label: string;
  onChangeTime: (time) => void;
}

export const TimeInput = ({ label, originalValue, onChangeTime }) => {
  const [value, setValue] = React.useState<string | null>(null);

  const handleTimeChange = (newValue: Dayjs | null) => {
    const hour = newValue.$H.toString().padStart(2, "0");
    const minute = newValue.$m.toString().padStart(2, "0");
    onChangeTime(`${hour}:${minute}`);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        label={label}
        value={value}
        onChange={(newValue) => handleTimeChange(newValue)}
      />
    </LocalizationProvider>
  );
};
