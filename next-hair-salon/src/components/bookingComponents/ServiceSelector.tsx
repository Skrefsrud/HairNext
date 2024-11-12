// ServicesSelector.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { Service } from "@/utils/interfaces";

interface Props {
  onServicesSubmit: (
    selectedServices: Service[],
    combinedPrice: number,
    combinedDuration: number
  ) => void;
}

const ServicesSelector: React.FC<Props> = ({ onServicesSubmit }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);

  const handleCheckboxChange = (serviceId: number) => {
    setSelectedServiceIds((prevIds) =>
      prevIds.includes(serviceId)
        ? prevIds.filter((id) => id !== serviceId)
        : [...prevIds, serviceId]
    );
  };

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("services")
        .select("id, name, price, description, time_requirement");

      if (error) {
        console.error(error);
      } else {
        setServices(data as Service[]);
      }
      setIsLoading(false);
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const newSelectedServices = services.filter((service) =>
      selectedServiceIds.includes(service.id)
    );

    const combinedPrice = newSelectedServices.reduce(
      (sum, service) => sum + service.price,
      0
    );

    const combinedDuration = newSelectedServices.reduce(
      (total, service) => total + parseInterval(service.time_requirement),
      0
    );

    onServicesSubmit(newSelectedServices, combinedPrice, combinedDuration);
  }, [selectedServiceIds, services]);

  const parseInterval = (intervalString: string): number => {
    const [hours, minutes] = intervalString
      .split(":")
      .map((part) => parseInt(part, 10));
    return hours * 60 + minutes;
  };

  const formatDuration = (intervalString: string): string => {
    const [hours, minutes] = intervalString
      .split(":")
      .map((part) => part.padStart(2, "0"));
    return `${hours}:${minutes}`;
  };

  return (
    <div className="p-4">
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Spinner /> {/* Loading spinner */}
          <p>Loading services...</p>
        </div>
      ) : (
        <ul>
          {services.map((service) => (
            <li key={service.id} className="flex items-center mb-2">
              <Checkbox
                id={`service-${service.id}`}
                checked={selectedServiceIds.includes(service.id)}
                onCheckedChange={() => handleCheckboxChange(service.id)}
              />
              <Label htmlFor={`service-${service.id}`} className="ml-2">
                {service.name} - kr {service.price} (Duration:{" "}
                {formatDuration(service.time_requirement)})
              </Label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ServicesSelector;
