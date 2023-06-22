import api from "../../../utils/api";

export const putAssignCourseService = (body) => {
  return api.put("/usercourse", body);
};
