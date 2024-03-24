import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useCallback, useEffect, useState } from "react";

interface TimeReqInputProps {
  prevTimeReq: string;
  onChange: (timeString: string) => void;
}

export function TimeReqInput({ prevTimeReq, onChange }: TimeReqInputProps) {
  const convertedPrevTimeReq = prevTimeReq.replace(/:/g, "");
  const [value, setValue] = useState(convertedPrevTimeReq);

  const handleComplete = useCallback(
    (newTimeReq) => {
      console.log("newTime: ", newTimeReq);
      console.log("prevTime: ", prevTimeReq);
      if (newTimeReq !== prevTimeReq) {
        // Check if changed

        onChange(newTimeReq);
      }
    },
    [onChange, prevTimeReq]
  );

  useEffect(() => {
    if (value.length === 4) {
      const hours = value.slice(0, 2);
      const minutes = value.slice(2, 4);

      const newTimeReq = `${hours}:${minutes}`;
      handleComplete(newTimeReq);
    }
  }, [value, handleComplete]);

  return (
    <InputOTP maxLength={4} value={value} onChange={setValue}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTPGroup>
    </InputOTP>
  );
}
