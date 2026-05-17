// src/redux/authSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import api, { setAccessToken } from "../AxioseApis/api";
import { isAxiosError } from "axios";

// 1. Industry Standard: Define precise type for User
export interface UserData {
  role: string;
  id?: string;
}

interface AuthState {
  isAuthenticated: boolean;                   
  userId: string | null;
  user: UserData | null; // <-- Changed to object
  loading: boolean;
  isInitialized: boolean;
  isOtpPending: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  userId: null,
  loading: true,
  isInitialized: false,
  isOtpPending: false,
};

export const checkAuthSession = createAsyncThunk(
  "auth/checkSession",
  async (_, { rejectWithValue }) => {
    try {
      const refreshResponse = await api.get("/auth/refresh-token");
      const accessToken = refreshResponse.data?.accessToken;
      if (accessToken) {
        setAccessToken(accessToken);
      }

      const response = await api.get("/auth/getme");
      return response.data.user;
    } catch (error: unknown) {
      setAccessToken(null);
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data || "Session expired");
      }
      return rejectWithValue("Something went wrong");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.userId = null;
      state.loading = false;
      state.isOtpPending = false;
      setAccessToken(null);
    },
    // Step 1: Signup par dispatch hoga
    setPendingVerification: (state, action: PayloadAction<{ userId: string }>) => {
      state.userId = action.payload.userId;
      state.isOtpPending = true;
      state.isAuthenticated = false; // OTP verify hona baki hai
    },
    // Step 2: OTP Success par dispatch hoga
    setCredentials: (state, action: PayloadAction<{ user: UserData }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true; // User officially logged in
      state.isOtpPending = false; 
      state.userId = null; // Login ho gaya to ab temporary ID ki jarurat nahi
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthSession.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload; // Backend user object dega
        state.loading = false;
        state.isInitialized = true;
      })
      .addCase(checkAuthSession.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.userId = null;
        state.loading = false;
        state.isInitialized = true;
      });
  },
});

export const { logout, setCredentials, setPendingVerification } = authSlice.actions;
export default authSlice.reducer;
