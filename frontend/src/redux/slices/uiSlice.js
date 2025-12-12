import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    viewMode: 'grid', // 'grid' | 'tile'
    sidebarOpen: false,
  },
  reducers: {
    toggleViewMode: (state) => {
      state.viewMode = state.viewMode === 'grid' ? 'tile' : 'grid';
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    }
  }
});

export const { toggleViewMode, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;