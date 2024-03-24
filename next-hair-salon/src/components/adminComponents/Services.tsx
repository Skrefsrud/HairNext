"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";
import { Button } from "../ui/button";
import { AddService } from "@/components/adminComponents/serviceComponents/AddService";
import { ComfirmServiceDelete } from "./serviceComponents/ComfirmServiceDelete";
import { ServiceFormData, deleteServiceById } from "@/lib/database";
import { ServiceEditRow } from "@/components/adminComponents/serviceComponents/ServiceEditRow";
import { ServiceTableRow } from "@/components/adminComponents/serviceComponents/ServiceTableRow";

interface Service {
  id: number;
  name: string;
  price: number;
  description: string;
  time_requirement: string;
}

function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editService, setEditService] = useState<Service | null>(null);

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

  const handleSaveService = async (updatedService: Service) => {
    try {
      console.log(
        "Received service to update (Services.tsx):",
        JSON.stringify(updatedService)
      );
      // 1. Send Update Request to API
      const response = await fetch("/api/services/updateService", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedService),
      });

      if (!response.ok) {
        throw new Error(`Error updating service: ${response.status}`);
      }

      const { success, error } = await response.json();

      if (success) {
        // 2. Update UI State on Success
        setServices((prevServices) =>
          prevServices.map((service) =>
            service.id === updatedService.id ? updatedService : service
          )
        );
      } else {
        // 3. Handle API Errors
        alert("Error updating service: " + error?.message);
      }
    } catch (error) {
      // 4. Handle Fetch Errors
      console.error("Error in handleSaveService:", error);
      alert(
        "An unexpected error occurred while updating the service. Please try again."
      );
    }
  };

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
              {services.map((service) =>
                service.id === editService?.id ? ( // Conditional rendering
                  <ServiceEditRow
                    key={service.id}
                    service={service}
                    handleSaveService={handleSaveService}
                    setEditService={setEditService}
                  />
                ) : (
                  <ServiceTableRow
                    key={service.id}
                    service={service}
                    setEditService={setEditService}
                    onDeleteConfirmed={handleDeleteConfirmed} // Assuming your delete logic exists
                  />
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Services;
