export interface Employee {
  id: number;
  first_name: string;
  surname: string;
  mobile: string;
  email: string;
  role: string;
  image_path: string;
}

// interfaces.ts

// StoreHour interface represents the operating hours of the store
export interface StoreHour {
  day_of_week: string;
  is_closed: boolean;
  opening_time: string;
  closing_time: string;
}

// TimeSlot interface represents an individual time slot, usually pulled from the database
export interface TimeSlot {
  id: number;
  time_stamp: string; // Stored as timestamptz in the database
}

// EmployeeAvailability interface represents the availability of an employee for specific time slots
export interface EmployeeAvailability {
  time_slot_id: number;
  employee_id: number;
  occupied_booking: number | null;
  occupied_other: number | null;
}

// GridCell interface represents a single cell in the grid showing availability and employees
export interface GridCell {
  available: boolean;
  time_slot_id: number | null;
  available_employees: number[];
}

// Props for WeekCalendar component
export interface WeekCalendarProps {
  employeeId: number;
  duration: number;
  onSelectTimeSlots: (timeSlots: number[]) => void;
}

// Props for TimeSlotGrid component
export interface TimeSlotGridProps {
  storeHours: StoreHour[];
  timeSlots: TimeSlot[];
  employeeAvailability: EmployeeAvailability[];
  onSlotSelect: (selectedSlotIds: number[]) => void;
}

export interface Service {
  id: number;
  name: string;
  price: number;
  description: string;
  time_requirement: string; // In format "HH:mm:ss"
}
