export function getErrorMessage(error: unknown): string {
  let message: string;

  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === 'object' && 'message' in error) {
    // This handles Supabase error objects and other similar structures
    message = String(error.message);
  } else if (typeof error === 'string') {
    message = error;
  } else {
    message = 'An unexpected error occurred. Please check the console for more details.';
  }
  
  // Provide more user-friendly messages for common network errors
  const lowerCaseMessage = message.toLowerCase();
  if (lowerCaseMessage.includes('load failed') || lowerCaseMessage.includes('failed to fetch')) {
      return 'A network error occurred. Please check your internet connection. Ad-blockers can sometimes interfere as well.';
  }

  return message;
}
