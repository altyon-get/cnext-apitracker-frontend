import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from '../../api/api'

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    error: null,
    admin: null,
  },
  reducers: {
    logOutAdmin: (state) => {
      state.admin = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const adminLogin = createAsyncThunk(
  "admin/login",
  async (info, { rejectWithValue }) => {
    try {
      const res = await api.post(
        `login/`,
        {
          username: info.username,
          password: info.password,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      localStorage.setItem("token", res?.data?.token);
      return res;
    } catch (error) {
      if(error.response){
        return rejectWithValue(error?.response?.data?.error);
      }
      else{
        return rejectWithValue(error?.message);
      }

    }
  }
);

export const { logOutAdmin } = adminSlice.actions;

export default adminSlice;
