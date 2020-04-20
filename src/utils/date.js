import {MONTH} from '../const';

export const castFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date) => {
  const hours = castFormat(date.getHours());
  const minutes = castFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

export const formatDate = (date, format = `Y-m-d`) => {
  const fullYear = date.getFullYear();
  const year = String(fullYear).substring(2);
  const monthInNumber = castFormat(date.getMonth() + 1);
  const month = MONTH[date.getMonth()];
  const day = castFormat(date.getDate());

  return format
    .replace(`Y`, fullYear)
    .replace(`y`, year)
    .replace(`m`, monthInNumber)
    .replace(`M`, month)
    .replace(`d`, day);
};

export const getTimeInterval = (dateStart, dateEnd) => {
  const diff = dateEnd - dateStart;

  const dayInMs = 1000 * 60 * 60 * 24;
  const hourInMs = 1000 * 60 * 60;
  const minuteInMs = 1000 * 60;

  const days = Math.floor(diff / dayInMs);
  let ml = diff % dayInMs;

  const hours = Math.floor(ml / hourInMs);
  ml = ml % hourInMs;

  const minutes = Math.floor(ml / minuteInMs);

  const daysStr = days > 0 ? `${castFormat(days)}D` : ``;
  const hoursStr = hours > 0 ? `${castFormat(hours)}H` : ``;
  const minutesStr = minutes > 0 ? `${castFormat(minutes)}M` : ``;

  return `${daysStr} ${hoursStr} ${minutesStr}`;
};
