import moment from 'moment';

export const formatTime = (date) => {
  return moment(date).format(`hh:mm`);
};

export const formatDate = (date, format = `Y-MM-DD`) => {
  return moment(date).format(format);
};

export const castFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const getTimeInterval = (dateStart, dateEnd) => {
  const diffTime = moment(dateEnd).diff(dateStart);
  const duration = moment.duration(diffTime);

  const mdays = duration.days() ? `${castFormat(duration.days())}D` : ``;
  const hrs = duration.hours() ? `${castFormat(duration.hours())}H` : ``;
  const mins = duration.minutes() ? `${castFormat(duration.minutes())}M` : ``;

  return `${mdays} ${hrs} ${mins}`;
};
