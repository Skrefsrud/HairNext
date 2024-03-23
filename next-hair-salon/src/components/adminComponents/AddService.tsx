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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type } from "os";
import { useState } from "react";
import { insertServiceToSupabase } from "@/lib/database";
import { AlertComponent } from "@/components/Alert";

export function AddService({ existingServiceNames, onServiceAdded }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(""); // Initialize price as empty
  const [timeReq, setTimeReq] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleNameChange = (event) => setName(event.target.value);
  const handlePriceChange = (event) => setPrice(event.target.value);
  const handleTimeReqChange = (event) => setTimeReq(event.target.value);
  const handleDescriptionChange = (event) => setDescription(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (name === "" || description === "" || timeReq === "" || price === "") {
      setErrorMessage("Please fill in all fields");
      return;
    }

    // Check for existing name
    if (existingServiceNames.includes(name.toLowerCase())) {
      setErrorMessage("A service with this name already exists!");
      return;
    }

    //Ensure time format
    if (timeReq % 15 !== 0) {
      setErrorMessage("Time requirement must be in 15-minute intervals");
      return;
    }

    const priceAsNumber = parseInt(price, 10);
    const timeReqAsNumber = parseInt(timeReq, 10);

    // Ensure price and timeReq were successfully converted to numbers
    if (isNaN(priceAsNumber) || isNaN(timeReqAsNumber)) {
      setErrorMessage(
        "Please enter valid numbers for price and time requirement."
      );
      return;
    }

    const formData = {
      name,
      price: priceAsNumber,
      timeReq: timeReqAsNumber,
      description,
    };

    console.log(
      "name type: ",
      typeof name,
      "price type: ",
      typeof priceAsNumber,
      "timeReq type: ",
      typeof timeReqAsNumber,
      "description type: ",
      typeof description
    );

    try {
      // Using a try/catch
      const { success, error } = await insertServiceToSupabase(formData);

      if (success) {
        // Success!
        alert("Service added successfully!");
        // Potentially update your displayed list of services (if applicable)
        // Consider closing the dialog
      } else {
        // Failure
        alert(`Error adding service: ${error?.message}`);
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add service</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Create new service for your salon
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              Name
            </Label>
            <Input
              id='name'
              value={name}
              onChange={handleNameChange}
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='price' className='text-right'>
              Price (kr)
            </Label>
            <Input
              id='price'
              type='number'
              value={price}
              onChange={handlePriceChange}
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='time-req' className='text-right'>
              Time requirement
            </Label>
            <Input
              id='time-req'
              value={timeReq}
              onChange={handleTimeReqChange}
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='description' className='text-right'>
              Description
            </Label>
            <Input
              id='description'
              value={description}
              onChange={handleDescriptionChange}
              className='col-span-3'
            />
          </div>
        </div>
        <DialogFooter>
          <Button type='submit' onClick={handleSubmit}>
            Submit service
          </Button>
        </DialogFooter>
        {errorMessage !== "" && (
          <AlertComponent
            variant='destructive'
            alertTitle='Error'
            errorMessage={errorMessage}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
