import { supabase } from "@/utils/supabase/supabaseClient"

async function createBooking(employeeID, selectedServices, startTime, mobileNumber) {
  // 1. Calculate End Time (You'd likely have this logic on the front-end)
  const totalDuration = // Logic to sum durations from selectedServices
  const endTime = // Calculate end time based on startTime and totalDuration

  // 2. Insert into 'booking'
  const { data: newBooking,  error: bookingError } = await supabase
    .from('booking')
    .insert({
      employee_id: employeeId,
      mobile: mobileNumber,
      // Add other booking details if needed 
    });  

  if (bookingError) { 
    throw bookingError; // Handle the error 
  }

  // 3. Insert into 'booking_times'
  const { data: bookingTimesData, error: bookingTimesError } = await supabase
     .from('booking_times')
     .insert([ // Insert multiple slots if needed 
       { booking_id: newBooking.id, time_slot_id: /* ID of the time slot */ }
     ]);  

  if (bookingTimesError) { 
    throw bookingTimesError; // Handle the error 
  }

  // 4. Insert into 'booking_services'
  const bookingServicesData = selectedServices.map(service => ({
    booking_id: newBooking.id, 
    service_id: service.id
  }));

  const { error: bookingServicesError } = await supabase
     .from('booking_services')
     .insert(bookingServicesData);  

  if (bookingServicesError) { throw bookingServicesError; }

  return newBooking.id; // Or return more detailed booking info 
}



async function findAvailableTimes(employeeID, date, selectedServices) {
  // ... Logic to calculate required time slots based on date, startTime and selectedServices

  const { data: availableSlots, error } = await supabase
    .from('time_slot')
    .select('id, time')
    .where(/* Conditions to match ALL required slots for the booking */);

  if (error) { throw error; }

  return availableSlots; 
}

