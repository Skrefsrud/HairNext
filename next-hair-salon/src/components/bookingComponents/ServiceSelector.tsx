import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Service {
  id: number;
  name: string;
  price: number;
  description: string;
  time_requirement: string;
}

interface Props {
  onServicesSubmit: (
    selectedServices: Service[],
    combinedPrice: number,
    combinedDuration: number
  ) => void;
}

const ServicesSelector = ({ onServicesSubmit }: Props) => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);

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
        // Handle error gracefully
      } else {
        setServices(data);
      }
      setIsLoading(false);
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const newSelectedServices = services.filter((service) =>
      selectedServiceIds.includes(service.id)
    );
    setSelectedServices(newSelectedServices);
  }, [selectedServiceIds, services]);

  const handleSubmit = () => {
    let combinedPrice = selectedServices.reduce(
      (sum, service) => sum + service.price,
      0
    );

    let combinedDuration = 0;
    selectedServices.forEach((service) => {
      combinedDuration += parseInterval(service.time_requirement);
    });

    onServicesSubmit(selectedServices, combinedPrice, combinedDuration);
  };

  const parseInterval = (intervalString: string): number => {
    const parts = intervalString.split(":");
    let totalMinutes = 0;
    for (let i = 0; i < parts.length; i++) {
      const value = parseInt(parts[i]);
      //Pars[0] is hours
      if (i === 0) {
        totalMinutes += value * 60;
        //Parts[1] is minutes
      } else if (i === 1) {
        totalMinutes += value;
      }
    }
    return totalMinutes;
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
                id={service.name}
                className='checkbox checkbox-primary'
                type='checkbox'
                value={service.id}
                onChange={() => handleCheckboxChange(service.id)}
                checked={selectedServiceIds.includes(service.id)}
              />
              <Label htmlFor={service.name}>
                {service.name} - {service.price} (Duration:{" "}
                {service.time_requirement})
              </Label>
            </li>
          ))}
        </ul>
      )}
      <Button onClick={handleSubmit}>Next</Button>
    </div>
  );
};

export default ServicesSelector;
