import {FilterType} from "../const";

const getEventsFuture = (events, date) => {
  return events.filter((event) => event.dueDateStart > date);
};

const getEventsPast = (events, date) => {
  return events.filter((event) => event.dueDateEnd < date);
};

export const getEventsByFilter = (events, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FilterType.EVERYTHING:
      return events;
    case FilterType.FUTURE:
      return getEventsFuture(events, nowDate);
    case FilterType.PAST:
      return getEventsPast(events, nowDate);
  }

  return events;
};
