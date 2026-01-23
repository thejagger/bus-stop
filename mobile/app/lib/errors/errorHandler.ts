import { ERROR_CODES, type ErrorCode } from "./errorCodes";

/**
 * Standard error response format
 * Follows architecture specification: { error: { code, message, details? }, success: false }
 */
export interface AppError {
  error: {
    code: ErrorCode;
    message: string;
    details?: unknown;
  };
  success: false;
}

/**
 * Error messages mapped to error codes
 */
const ERROR_MESSAGES: Record<ErrorCode, string> = {
  // Bluetooth BLE Errors
  [ERROR_CODES.BLE_NOT_ENABLED]: "Bluetooth is not enabled. Please enable Bluetooth in your device settings.",
  [ERROR_CODES.BLE_PERMISSION_DENIED]: "Bluetooth permission denied. Please grant Bluetooth permission in app settings.",
  [ERROR_CODES.BLE_LOCATION_PERMISSION_DENIED]: "Location permission is required for Bluetooth scanning. Please grant location permission in app settings.",
  [ERROR_CODES.BLE_DEVICE_NOT_FOUND]: "Device not found. Make sure the device is powered on and in pairing mode.",
  [ERROR_CODES.BLE_CONNECTION_FAILED]: "Failed to connect to device. Please try again.",
  [ERROR_CODES.BLE_PAIRING_FAILED]: "Device pairing failed. Make sure the device is in pairing mode and try again.",
  [ERROR_CODES.BLE_DISCONNECTED]: "Device disconnected. Please reconnect.",
  [ERROR_CODES.BLE_CHARACTERISTIC_NOT_FOUND]: "Bluetooth characteristic not found.",
  [ERROR_CODES.BLE_WRITE_FAILED]: "Failed to send data to device.",
  [ERROR_CODES.BLE_READ_FAILED]: "Failed to read data from device.",

  // Device Errors
  [ERROR_CODES.DEVICE_NOT_FOUND]: "Device not found.",
  [ERROR_CODES.DEVICE_NOT_REGISTERED]: "Device is not registered. Please complete device setup.",
  [ERROR_CODES.DEVICE_REGISTRATION_FAILED]: "Failed to register device. Please try again.",
  [ERROR_CODES.DEVICE_OFFLINE]: "Device is offline. Please check device connection.",
  [ERROR_CODES.DEVICE_KEY_INVALID]: "Invalid device key. Please re-register the device.",
  [ERROR_CODES.DEVICE_CONFIG_FAILED]: "Failed to configure device. Please try again.",

  // Network Errors
  [ERROR_CODES.NETWORK_UNAVAILABLE]: "Network unavailable. Please check your internet connection.",
  [ERROR_CODES.NETWORK_TIMEOUT]: "Network request timed out. Please try again.",
  [ERROR_CODES.WIFI_CONNECTION_FAILED]: "Failed to connect to WiFi network. Please check network credentials.",
  [ERROR_CODES.WIFI_INVALID_CREDENTIALS]: "Invalid WiFi credentials. Please check your password.",
  [ERROR_CODES.WIFI_NETWORK_NOT_FOUND]: "WiFi network not found. Please check network availability.",

  // API Errors
  [ERROR_CODES.API_UNAVAILABLE]: "Service temporarily unavailable. Please try again later.",
  [ERROR_CODES.API_RATE_LIMIT_EXCEEDED]: "Too many requests. Please wait a moment and try again.",
  [ERROR_CODES.API_AUTHENTICATION_FAILED]: "Authentication failed. Please check your credentials.",
  [ERROR_CODES.API_INVALID_RESPONSE]: "Invalid response from server. Please try again.",
  [ERROR_CODES.SUPABASE_CONNECTION_FAILED]: "Failed to connect to backend. Please check your connection.",

  // Validation Errors
  [ERROR_CODES.VALIDATION_FAILED]: "Validation failed. Please check your input.",
  [ERROR_CODES.INVALID_INPUT]: "Invalid input provided.",
  [ERROR_CODES.MISSING_REQUIRED_FIELD]: "Required field is missing.",

  // Storage Errors
  [ERROR_CODES.STORAGE_READ_FAILED]: "Failed to read from storage.",
  [ERROR_CODES.STORAGE_WRITE_FAILED]: "Failed to save to storage.",
  [ERROR_CODES.STORAGE_DELETE_FAILED]: "Failed to delete from storage.",

  // Unknown Errors
  [ERROR_CODES.UNKNOWN_ERROR]: "An unexpected error occurred. Please try again.",
};

/**
 * Creates a standardized error object
 */
export function createError(
  code: ErrorCode,
  details?: unknown
): AppError {
  return {
    error: {
      code,
      message: ERROR_MESSAGES[code],
      ...(details && { details }),
    },
    success: false,
  };
}

/**
 * Checks if an error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === "object" &&
    error !== null &&
    "error" in error &&
    "success" in error &&
    (error as AppError).success === false
  );
}

/**
 * Extracts error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (isAppError(error)) {
    return error.error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR];
}

/**
 * Extracts error code from various error types
 */
export function getErrorCode(error: unknown): ErrorCode {
  if (isAppError(error)) {
    return error.error.code;
  }
  return ERROR_CODES.UNKNOWN_ERROR;
}
