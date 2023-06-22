import api from '../../../utils/api'

export const getCoursesService = () => {
  return api.get('/courses')
}