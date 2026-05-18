
import { isAxiosError } from "axios";
import api from "../AxioseApis/api";
import type {VerifyOtpRequest, VerifyOtpResponse} from "../Utlis/Types"

export interface RegisterData {
  username: string;
  email: string;
  password: string;
} 
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  success: boolean;
data?: {
  role: string;
};
}

export interface AddReportResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export interface ReportImage {
  url: string;
  public_id?: string;
  _id?: string;
}

export interface ReportItem {
  _id: string;
  name: string;
  date: string;
  title: string;
  images: ReportImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ReportPagination {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

export interface GetReportsResponse {
  success: boolean;
  message: string;
  pagination: ReportPagination;
  data: ReportItem[];
}

export const registerUser = async(Userdate:RegisterData) => {
  const res = await api.post("/auth/register",Userdate)
  return res.data
}  

export const verifiyotp = async(data:VerifyOtpRequest) => {
  const res = await api.post<VerifyOtpResponse>("auth/verifyotp",data)
  return res.data
}
  
export const logoutuser = async () => {
  const response = await api.get("/auth/logout");
  return response.data;
};

export const loginUser = async (credentials: LoginCredentials) => {
  const res = await api.post<LoginResponse>("/auth/login", credentials);
  return res.data;
};

export const addReport = async (reportData: globalThis.FormData) => {
  const res = await api.post("/report/add-report", reportData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

export const getReports = async (page = 1, limit = 6) => {
  const res = await api.get<GetReportsResponse>("/report/get-reports", {
    params: { page, limit },
  });
  return res.data;
};

export function getRequestErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const body = error.response?.data as { message?: string } | undefined;
    if (body?.message) return body.message;
    if (error.response?.status === 0 || error.code === "ERR_NETWORK") {
      return "Network error. Check your connection and API URL.";
    }
    return error.message || "Request failed";
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}
