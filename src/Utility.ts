import { Timestamp } from "firebase/firestore";

export function toDate(date: Date | Timestamp): Date {
    if (date instanceof Timestamp) {
      return date.toDate();
    } else if (date instanceof Date) {
      return date;
    } else {
      throw new Error('Invalid date type');
    }
  }


  export function formatDate(value: Date | Timestamp | string): string {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString().split('T')[0];
  } else if (value instanceof Date) {
    return value.toISOString().split('T')[0];
  } else if (typeof value === 'string') {
    return value;
  } else {
    throw new Error('Invalid date type');
  }
}