// ServiceCard.tsx
import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Service } from "@/utils/interfaces";

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onSelect: (serviceId: number) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  isSelected,
  onSelect,
}) => {
  const handleClick = () => {
    onSelect(service.id);
  };

  return (
    <Card
      className={`cursor-pointer ${
        isSelected ? "border-blue-500" : "border-gray-300"
      }`}
      onClick={handleClick}
    >
      <CardHeader>
        <CardTitle>{service.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Price: kr {service.price}</p>
        <p>Duration: {formatDuration(service.time_requirement)}</p>
      </CardContent>
    </Card>
  );
};

const formatDuration = (intervalString: string): string => {
  const [hours, minutes] = intervalString
    .split(":")
    .map((part) => part.padStart(2, "0"));
  return `${hours}:${minutes}`;
};

export default ServiceCard;
