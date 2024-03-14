import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";

const ServicesSelector = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("services")
        .select("service_id, name, price, description, time_requirement");

      if (error) {
        console.error(error);
        // Handle error gracefully, maybe display a message
      } else {
        setServices(data);
      }
      setIsLoading(false);
    };

    fetchServices();
  }, []);

  return (
    <div>
      {isLoading ? (
        <p>Loading services...</p>
      ) : (
        <ul>
          {services.map((service) => (
            <li key={service.service_id}>
              <label>
                <input type='checkbox' value={service.id} />
                {service.name} - {service.price} (Duration:{" "}
                {service.time_requirement})<p>{service.description}</p>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ServicesSelector;
