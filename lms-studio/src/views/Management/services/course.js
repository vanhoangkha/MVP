<<<<<<< HEAD
import api from '../../../utils/api'

const getPublicCoursesService = () => {
  return api.get('/courses/public')
}

const getMyCoursesService = () => {
  return api.get('/courses')
}

export {getPublicCoursesService, getMyCoursesService}
||||||| 33fbbd1
=======
import api from '../../../utils/api'

export const getCoursesService = () => {
  return api.get('/courses')
}
>>>>>>> features/managements
