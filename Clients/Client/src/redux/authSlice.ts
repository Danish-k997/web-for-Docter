import {createSlice} from "@reduxjs/toolkit"

interface AuthState {
  userId: string | null;
}

const initialState:AuthState = {
  userId:null
} 

const authSlice = createSlice({
  name:"auth",

  initialState,

  reducers:{
    setuserId:(state, action) =>{
        state.userId = action.payload        
    }
  }
})

export const {setuserId} = authSlice.actions

export default authSlice.reducer;

