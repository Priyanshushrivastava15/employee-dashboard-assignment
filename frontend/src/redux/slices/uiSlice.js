import { createSlice } from '@reduxjs/toolkit';

// Helper to read from LocalStorage
const loadState = (key, fallback) => {
  try {
    const serialized = localStorage.getItem(key);
    return serialized ? JSON.parse(serialized) : fallback;
  } catch (e) {
    return fallback;
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    viewMode: loadState('viewMode', 'tile'), // Persist View
    theme: loadState('theme', 'light'),      // Persist Theme
    isSidebarOpen: true,
    page: 1,                                 // Redux Pagination
    flaggedIds: loadState('flaggedIds', []), // Persist Flags
  },
  reducers: {
    toggleViewMode: (state) => {
      state.viewMode = state.viewMode === 'grid' ? 'tile' : 'grid';
      localStorage.setItem('viewMode', JSON.stringify(state.viewMode));
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', JSON.stringify(state.theme));
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebar: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    // Pagination Action
    setPage: (state, action) => {
      state.page = action.payload;
    },
    // Flagging Action (Toggle)
    toggleFlag: (state, action) => {
      const id = action.payload;
      if (state.flaggedIds.includes(id)) {
        state.flaggedIds = state.flaggedIds.filter(fId => fId !== id);
      } else {
        state.flaggedIds.push(id);
      }
      localStorage.setItem('flaggedIds', JSON.stringify(state.flaggedIds));
    }
  }
});

export const { toggleViewMode, setTheme, toggleSidebar, setSidebar, setPage, toggleFlag } = uiSlice.actions;
export default uiSlice.reducer;