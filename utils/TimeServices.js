import { format } from 'date-fns';

export const updateDateTime = () => {
  const currentDate = new Date();
  const dateFormat = 'd MMM yyyy @hh:mm a';
  const formattedDate = format(currentDate, dateFormat);
  return formattedDate;
};
