// src/redux/notificationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  count: 0,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications(state, action) {
      state.list = action.payload;
      state.count = action.payload.filter((n) => !n.isRead).length;
    },
    addNotification(state, action) {
      const exists = state.list.some((n) => n.id === action.payload.id);
      if (!exists) {
        state.list.unshift({ ...action.payload, isRead: false });
        state.count += 1;
      }
    },
    markAsRead(state, action) {
      const id = action.payload;
      state.list = state.list.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      state.count = state.list.filter((n) => !n.isRead).length;
    },
    clearNotifications(state) {
      state.list = [];
      state.count = 0;
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsRead,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
