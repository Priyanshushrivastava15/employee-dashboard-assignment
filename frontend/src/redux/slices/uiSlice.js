import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    viewMode: 'tile', // 'grid' | 'tile'
    theme: 'light',   // 'light' | 'dark' | 'holo'
    isSidebarOpen: true, // Defaults to open (We will fix this for mobile in Dashboard)
  },
  reducers: {
    toggleViewMode: (state) => {
      state.viewMode = state.viewMode === 'grid' ? 'tile' : 'grid';
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    // NEW: Allows us to force open/close based on screen size
    setSidebar: (state, action) => {
      state.isSidebarOpen = action.payload;
    }
  }
});

export const { toggleViewMode, setTheme, toggleSidebar, setSidebar } = uiSlice.actions;
export default uiSlice.reducer;