// ServiceEditRow.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TimeReqInput } from "./timeReqInput";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  time_requirement: string;
}

interface ServiceEditRowProps {
  service: Service;
  handleSaveService: (updatedService: Service) => void;
  setEditService: (service: Service | null) => void;
}

export const ServiceEditRow: React.FC<ServiceEditRowProps> = ({
  service,
  handleSaveService,
  setEditService,
}) => {
  const [updatedService, setUpdatedService] = useState<Service>(service);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedService({
      ...updatedService,
      [event.target.name]:
        event.target.type === "number"
          ? Number(event.target.value)
          : event.target.value,
    });
    console.log(updatedService);
  };

  const handleSave = () => {
    handleSaveService(updatedService);
    setEditService(null); // Exit edit mode
  };

  const handleCancel = () => {
    setEditService(null); // Exit edit mode without saving
  };

  return (
    <tr key={service.id}>
      <td>
        <Input
          type='text'
          name='name'
          value={updatedService.name}
          onChange={handleInputChange}
        />
      </td>
      <td>
        <Input
          type='text'
          name='description'
          value={updatedService.description}
          onChange={handleInputChange}
        />
      </td>
      <td>
        <Input
          type='number' // Input type for price
          name='price'
          value={updatedService.price}
          onChange={handleInputChange}
        />
      </td>
      <td>
        <TimeReqInput
          prevTimeReq={updatedService.time_requirement}
          onChange={(newValue) =>
            setUpdatedService({
              ...updatedService,
              time_requirement: newValue,
            })
          }
        />
      </td>
      <td className='flex justify-end gap-4'>
        <Button className='px-3 py-1' onClick={handleSave}>
          Save
        </Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </td>
    </tr>
  );
};
