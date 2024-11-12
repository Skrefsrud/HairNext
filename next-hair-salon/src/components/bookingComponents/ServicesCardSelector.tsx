// ServicesSelector.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";
import ServiceCard from "./ServiceCard";
import { Service } from "@/utils/interfaces";

interface Props {
  onServicesSubmit: (
    selectedServices: Service[],
    combinedPrice: number,
    combinedDuration: number
  ) => void;
}

const ServicesCardSelector: React.FC<Props> = ({ onServicesSubmit }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);

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

  const handleSelect = (serviceId: number) => {
    setSelectedServiceIds((prevIds) =>
      prevIds.includes(serviceId)
        ? prevIds.filter((id) => id !== serviceId)
        : [...prevIds, serviceId]
    );
  };

  return (
    <div className="p-4">
      {isLoading ? (
        <div className="flex justify-center items-center">
          <p>Loading services...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              isSelected={selectedServiceIds.includes(service.id)}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesCardSelector;
