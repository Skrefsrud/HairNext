export interface StoreHour {
  id: number;
  day_of_week: string;
  opening_time: string | null;
  closing_time: string | null;
  is_closed: boolean;
}
