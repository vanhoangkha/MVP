import moment from "moment";

export const covertTime = (time) => {
    let str_time =  (Math.floor(time / 3600) > 0 ? Math.floor(time / 3600) + " hours " : "") + 
    ((time % 3600) / 60 > 0 ? Math.floor((time % 3600) / 60) + " minutes " : "") + 
    ((time % 3600) % 60 > 0 ? (time % 3600) % 60 + " seconds" : "");
    return str_time;
}

export function transformDateTime(createAt) {
    const date = moment(createAt);
    return date.calendar(null, {
      sameDay: "LT",
      lastDay: "MMM D LT",
      lastWeek: "MMM D LT",
      sameElse: "l",
    });
  }