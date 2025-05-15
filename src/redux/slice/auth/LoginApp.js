import AuthApiService from '@/api-services/api/auth/AuthApiService';
import { ETypeNotification } from '@/common/enums';
import { showNotification } from '@/utils/functions';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  username: null,
  isLoading: false,
  loading: 'idle' | 'pending' | 'succeeded' | 'failed',
  error: null,
  accessStore: false,
  hasPassword: false,
};

export const loginApps = createAsyncThunk('auth/loginApp', async (credentials) => {
  const response = await AuthApiService.loginApp({ body: credentials });
  if (response.code === 101) {
    showNotification(ETypeNotification.ERROR, response.message);
  }

  return response;
});

export const loginGoogle = createAsyncThunk('auth/loginGoogle', async (params) => {
  const response = await AuthApiService.googleLogin({ params });
  if (response.code === 101) {
    showNotification(ETypeNotification.ERROR, response.message);
  }

  return response;
});

const loginAppSlice = createSlice({
  name: 'loginApp',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.username = null;
      state.status = 'idle';
      state.error = null;
      state.accessStore = false;
      state.hasPassword = false;
    },
    resetLoginError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginApps.pending, (state) => {
        state.isLoading = true;
        state.status = 'loading';
      })
      .addCase(loginApps.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = 'succeeded';
        state.user = action.payload.fullname;
        state.accessToken = action.payload.token;
        state.refreshToken = action.payload.refresh_token;
        state.username = action.payload.username;
        state.accessStore = action.payload.access_store;
        state.hasPassword = action.payload.has_password;
      })
      .addCase(loginApps.rejected, (state, action) => {
        state.isLoading = false;
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })

      // Add case for googleLogin action
      .addCase(loginGoogle.pending, (state) => {
        state.isLoading = true;
        state.status = 'loading';
      })
      .addCase(loginGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = 'succeeded';
        state.user = action.payload.fullname;
        state.accessToken = action.payload.token;
        state.refreshToken = action.payload.refresh_token;
        state.username = action.payload.username;
        state.accessStore = action.payload.access_store;
        state.hasPassword = action.payload.has_password;
      })
      .addCase(loginGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const { logout, resetLoginError } = loginAppSlice.actions;

export default loginAppSlice.reducer;
