import { format } from 'date-fns';

/**
 * toLocalDateString — LOCAL date string (yyyy-MM-dd), kabhi
 * toISOString() nahi (wo UTC me convert karta hai, jis se Pakistan
 * (UTC+5) me raat 12 se subah 5 baje ke darmiyan "aaj" ki attendance
 * "kal" ki tareekh me save ho jati thi — yehi wo bug tha).
 */
export function toLocalDateString(date = new Date()) {
  return format(date, 'yyyy-MM-dd');
}