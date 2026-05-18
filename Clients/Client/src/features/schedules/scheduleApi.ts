import api from "../../AxioseApis/api";
import type { AddSchedulePayload, DoctorSchedule } from "./scheduleTypes";

type ScheduleListResponse = {
  success: boolean;
  data: DoctorSchedule[];
  message?: string;
};

type AddScheduleResponse = {
  success: boolean;
  message: string;
  data: DoctorSchedule;
};

export const getSchedules = async () => {
  const response = await api.get<ScheduleListResponse>("/schedule/getschedule");
  return response.data;
};

export const addSchedule = async (payload: AddSchedulePayload) => {
  const response = await api.post<AddScheduleResponse>(
    "/schedule/addschedule",
    payload,
  );
  return response.data;
};
