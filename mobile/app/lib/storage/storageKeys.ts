/**
 * AsyncStorage key constants
 * Format: @busstop:{feature}:{resource}
 */

export const STORAGE_KEYS = {
  // Device storage
  device: {
    info: (deviceId: string) => `@busstop:device:${deviceId}:info`,
    config: (deviceId: string) => `@busstop:device:${deviceId}:config`,
  },
  // App state
  app: {
    lastDeviceId: "@busstop:app:lastDeviceId",
    onboardingComplete: "@busstop:app:onboardingComplete",
  },
} as const;
