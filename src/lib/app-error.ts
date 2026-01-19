/**
 * Custom error class for standardizing application errors.
 * This ensures all errors thrown from the data layer have a predictable structure.
 */
export class AppError extends Error {
  // Use a status code if you want to differentiate errors (e.g., 404, 401)
  public status?: number;

  // The user-friendly message for the toaster
  public displayMessage: string;

  // The raw error object from Supabase (for logging/debugging)
  public originalError: any;

  // Contextual information
  public context: {
    tableName: string;
    operation: 'FETCH' | 'UPSERT' | 'DELETE' | 'SCHEMA_PARSE';
  };

  constructor(
      displayMessage: string,
      originalError: any,
      context: {
        tableName: string;
        operation: 'FETCH' | 'UPSERT' | 'DELETE' | 'SCHEMA_PARSE';
      },
      status?: number
  ) {
    // Call the base Error constructor with a detailed message for logs
    super(`[${context.tableName} - ${context.operation}] ${displayMessage}`);

    this.name = 'AppError';
    this.displayMessage = displayMessage;
    this.originalError = originalError;
    this.context = context;
    this.status = status || originalError?.code || originalError?.status;

    // Maintain proper stack trace for debuggability
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}