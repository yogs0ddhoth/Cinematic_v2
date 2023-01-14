export class ValidateError extends Error {
  name = 'ValidateError';
  constructor(message: string, options?: { [key: string]: any }) {
    super(message, options);
  }
}
