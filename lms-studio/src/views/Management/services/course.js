import api from '../../../utils/api'

const getPublicCoursesService = () => {
  return api.get('/courses/public')
}

const getMyCoursesService = () => {
  return api.get('/courses')
}

export {getPublicCoursesService, getMyCoursesService}