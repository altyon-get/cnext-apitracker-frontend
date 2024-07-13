import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

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
      const res = await axios.post(
        `http://127.0.0.1:8000/login/`,
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
      // console.log(error.response.data.error,'error in adminLogin slice')
      return rejectWithValue(error?.response?.data?.error);
    }
  }
);

export const { logOutAdmin } = adminSlice.actions;

export default adminSlice;
