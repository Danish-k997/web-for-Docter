import { isAxiosError } from "axios";
import api from "../AxioseApis/api";
import type {VerifyOtpRequest, VerifyOtpResponse} from "../Utlis/Types"

export interface RegisterData {
  username: string;
  email: string;
  password: string;
} 


export const registerUser = async(Userdate:RegisterData) => {
  const res = await api.post("/auth/register",Userdate)
  return res.data
}  

export const verifiyotp = async(data:VerifyOtpRequest) => {
  const res = await api.post<VerifyOtpResponse>("auth/verifyotp",data)
  return res.data
}


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
