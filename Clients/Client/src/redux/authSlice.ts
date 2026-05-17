import {createSlice} from "@reduxjs/toolkit"

interface AuthState {
  userId: string | null;
  user: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState:AuthState = {
  userId:null,
  user:null,
  isAuthenticated:false,
  loading:false,
} 

const authSlice = createSlice({
  name:"auth",

  initialState,

  reducers:{
    setuserId:(state, action) =>{
        state.userId = action.payload        
    },
    setUser:(state, action) =>{
        state.user = action.payload
    },
    setIsAuthenticated:(state, action) =>{
        state.isAuthenticated = action.payload
    },
    setLoading:(state, action) =>{
        state.loading = action.payload
    }
  }
})

export const {setuserId, setUser, setIsAuthenticated, setLoading} = authSlice.actions

export default authSlice.reducer;

