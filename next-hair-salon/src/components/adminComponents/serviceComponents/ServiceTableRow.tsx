// ServiceTableRow.tsx
import React from "react";
import { ComfirmServiceDelete } from "./ComfirmServiceDelete";
import { Button } from "@/components/ui/button";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  time_requirement: string;
}

interface ServiceTableRowProps {
  service: Service;
  setEditService: (service: Service) => void;
  onDeleteConfirmed: (service: Service) => void;
}

export const ServiceTableRow: React.FC<ServiceTableRowProps> = ({
  service,
  setEditService,
  onDeleteConfirmed,
}) => {
  const handleDeleteConfirmed = (service: Service) => {
    onDeleteConfirmed(service);
  };
  return (
    <tr key={service.id} className='hover'>
      <td>{service.name}</td>
      <td>{service.description}</td>
      <td>{service.price}</td>
      <td>{service.time_requirement}</td>
      <td className='flex justify-end gap-4'>
        <Button
          onClick={() => setEditService(service)}
          className='px-3 py-1'
          variant='secondary'
        >
          Edit Service
        </Button>
        <ComfirmServiceDelete
          buttonContent='Delete Service'
          title='Delete Service'
          description='Are you sure you want to delete this service? All analytical data associated with this service will be deleted.'
          service={service}
          onDeleteConfirmed={handleDeleteConfirmed} // Assuming you still have this handler
        />
      </td>
    </tr>
  );
};
