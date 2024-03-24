"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";
import { Button } from "../ui/button";
import { AddService } from "@/components/adminComponents/AddService";
import { ComfirmServiceDelete } from "../AlertDialog";
import { ServiceFormData, deleteServiceById } from "@/lib/database";

interface Service {
  id: number;
  name: string;
  price: number;
  description: string;
  time_requirement: string;
}

function Services() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const serviceNames = [];
  services.map((service) => {
    serviceNames.push(service.name.toLowerCase());
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase.from("services").select("*");

        if (error) throw error;

        setServices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  function handleServiceAdded(newService: ServiceFormData) {
    setServices((prevServices) => [...prevServices, newService]);
  }

  async function handleDeleteConfirmed(service: Service) {
    console.log("Delete confirmed by user!", service);

    console.log(JSON.stringify({ service }));

    try {
      const response = await fetch("/api/services/deleteService", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service }),
      });

      if (!response.ok) {
        throw new Error(`Error deleting service: ${response.status}`);
      }

      const { success, error } = await response.json();

      if (success) {
        // Success!
        setServices((prevServices) =>
          prevServices.filter((prevService) => prevService.id !== service.id)
        );
        console.log("Service deleted successfully");
      } else {
        alert("Error deleting service: " + error?.message);
      }
    } catch (error) {
      console.error("Error in handleDeleteConfirmed:", error);
      alert(
        "An unexpected error occurred while deleting the service. Please try again."
      );
    }
  }

  return (
    <div>
      {isLoading && <p>Loading services...</p>}
      {error && <p>Error loading services: {error}</p>}

      {!isLoading && !error && (
        <div className='overflow-x-auto'>
          <table className='table'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Time Requirement</th>
                <th className='flex justify-end'>
                  <AddService
                    existingServiceNames={serviceNames}
                    onServiceAdded={handleServiceAdded}
                  ></AddService>
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className='hover'>
                  <td>{service.name}</td>
                  <td>{service.description}</td>
                  <td>{service.price}</td>
                  <td>{service.time_requirement}</td>
                  <td className='flex justify-end gap-4'>
                    <Button className='px-3 py-1' variant='secondary'>
                      Edit Service
                    </Button>
                    <ComfirmServiceDelete
                      buttonContent='Delete Service'
                      title='Delete Service'
                      description='Are you sure you want to delete this service?'
                      service={service}
                      onDeleteConfirmed={handleDeleteConfirmed}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Services;
