import { create } from "zustand";

interface DeviceState {
  // Store state will be defined in future stories
}

interface DeviceActions {
  // Store actions will be defined in future stories
}

export const useDeviceStore = create<DeviceState & DeviceActions>(() => ({
  // Store implementation will be added in future stories
}));
