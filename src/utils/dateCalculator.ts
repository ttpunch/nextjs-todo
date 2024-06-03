import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export default function calculateProgress(startdate: string, enddate: string): number {
  // Adjust the format string to match the date format
  const format = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
  const startDate = dayjs(startdate, format);
  console.log(startDate)
  const endDate = dayjs(enddate, format);
  const currentDate = dayjs();

  // Calculate the difference in days
  const totalDays = endDate.diff(startDate, 'day');
  const elapsedDays = currentDate.diff(startDate, 'day');

  // Calculate the progress percentage
  let percentage = 0;
  if (totalDays > 0) {
    percentage = (elapsedDays / totalDays) * 100;
  }

  // Ensure the percentage is between 0 and 100
  return Math.min(Math.max(percentage, 0), 100);
}
