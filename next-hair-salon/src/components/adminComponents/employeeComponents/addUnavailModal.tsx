import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function AddUnavailModal(dates: Date[]) {
  const [cause, setCause] = useState("Select");
  const [description, setDescription] = useState("Description");
  const [isFormValid, setIsFormValid] = useState(false);

  function handleSubmit() {
    event.preventDefault();
    const isValid = cause !== "" && description !== "";
    setIsFormValid(isValid);
    console.log(cause, description);
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='secondary'>Add unavailability</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add unavailability</DialogTitle>
          <DialogDescription>
            Select the cause for the unavailability, describe the situation in
            short terms, if it only affects parts of the day, select the time
            range. Then press save to add a new unavailability.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='cause' className='text-right'>
              Cause
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline'>{cause}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56 bg-secondary '>
                <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={cause} onValueChange={setCause}>
                  <DropdownMenuRadioItem className='text-white' value='sick'>
                    Sick
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    className='text-white'
                    value='vacation'
                  >
                    Vacation
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    className='text-white'
                    value='emergency'
                  >
                    Emergency
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='description' className='text-right'>
              Description
            </Label>
            <Input
              id='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='col-span-3'
            />
          </div>
          <label className='label cursor-pointer grid grid-cols-4 items-center gap-4'>
            <span className='label-text'>
              {dates.dates.length > 1 ? "Entire days" : "Entire day"}
            </span>
            <input
              type='checkbox'
              defaultChecked
              className='checkbox checkbox-primary col-span-3'
            />
          </label>
        </div>
        <DialogFooter>
          <Button type='submit' variant='secondary' onClick={handleSubmit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
