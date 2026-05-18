export const SCHEDULE_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export type ScheduleDay = (typeof SCHEDULE_DAYS)[number];

export type ScheduleDoctor = {
  _id: string;
  name?: string;
  username?: string;
  email?: string;
  specialization?: string;
  role?: string;
};

export type DoctorSchedule = {
  _id: string;
  doctorId?: ScheduleDoctor | string;
  dayOfWeek: ScheduleDay;
  startTime: string;
  endTime: string;
  location: string;
  updatedAt?: string;
};

export type AddSchedulePayload = {
  dayOfWeek: ScheduleDay;
  startTime: string;
  endTime: string;
  location: string;
};

export type ScheduleFieldErrors = Partial<Record<keyof AddSchedulePayload, string>>;
