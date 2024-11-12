// ServicesSelector.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";
import { Label } from "@/components/ui/label";
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
    setSelectedServiceIds((prevIds) => {
      if (prevIds.includes(serviceId)) {
        return prevIds.filter((id) => id !== serviceId);
      } else {
        return [...prevIds, serviceId];
      }
    });
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
  }, [selectedServiceIds, services]); // Removed onServicesSubmit from dependencies

  const parseInterval = (intervalString: string): number => {
    const [hours, minutes, seconds] = intervalString
      .split(":")
      .map((part) => parseInt(part, 10));
    return hours * 60 + minutes + seconds / 60;
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading services...</p>
      ) : (
        <ul>
          {services.map((service) => (
            <li key={service.id}>
              <input
                id={`service-${service.id}`}
                type="checkbox"
                value={service.id}
                onChange={() => handleCheckboxChange(service.id)}
                checked={selectedServiceIds.includes(service.id)}
              />
              <Label htmlFor={`service-${service.id}`}>
                {service.name} - ${service.price} (Duration:{" "}
                {service.time_requirement})
              </Label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ServicesSelector;
