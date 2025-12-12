import { createSlice } from '@reduxjs/toolkit';

// Helper to safely parse JSON from localStorage without crashing
const getFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage`, error);
    // If data is corrupted, clear it so the app works next time
    localStorage.removeItem(key);
    return null;
  }
};

const initialState = {
  user: getFromStorage('user'),
  token: getFromStorage('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      // Save to local storage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', JSON.stringify(token));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;