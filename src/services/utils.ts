import { v1 as uuidv1 } from 'uuid';
import { v4 as uuidv4 } from 'uuid';

export function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export const isBoolean = (val: any) => val === false || val === true;

export function toBoolean(value: any, defaultIfUndefined = false) {
  if (typeof value === "undefined") {
    return defaultIfUndefined;
  }
  if (typeof value === "string") {
    value = value.toLowerCase();
  }
  switch (value) {
    case true:
    case "true":
    case 1:
    case "1":
    case "on":
    case "yes":
      return true;
    default:
      return false;
  }
}

export class AppError extends Error {
  code: string;
  type: string;
  statusCode: number;
  constructor(message: string, code: string = "ERROR", statusCode: number = 500, type: string = "") {
    super(message);

    this.message = message;
    this.code = code;
    this.type = type;
    this.statusCode = statusCode;
  }
}

export function InternalApplicationError(message: string, type: string) {
  return new AppError(message, "ERROR", 500, type);
}

const errorTypes = {
  INVALID_EVENTS_COLLECTION: { message: "Invalid or missing events collection.", code: "BAD_INPUT", statusCode: 400 },
  INVALID_CATEGORY: { message: "Invalid or missing category", code: "BAD_INPUT", statusCode: 400 },
  INVALID_ACTION: { message: "Invalid or missing action", code: "BAD_INPUT", statusCode: 400 },
  INVALID_DATA: { message: "Invalid or missing data", code: "BAD_INPUT", statusCode: 400 },
  INVALID_PUBLIC_KEY: { message: "Invalid or missing public_key", code: "BAD_INPUT", statusCode: 403 },
  INVALID_PRIVATE_KEY: { message: "Invalid or missing public_key", code: "BAD_INPUT", statusCode: 403 },
  INVALID_ORIGIN: { message: "Invalid or missing origin for this public_key", code: "BAD_INPUT", statusCode: 403 },
};

export function StandardError(type: keyof typeof errorTypes) {
  if (errorTypes.hasOwnProperty(type)) {
    const { message, code, statusCode } = errorTypes[type];
    return new AppError(message, code, statusCode, type);
  }
  return new AppError("Invalid error type: " + type, "APPLICATION_ERROR", 500, "INVALID_ERROR_TYPE");
}

export { uuidv1, uuidv4 };
