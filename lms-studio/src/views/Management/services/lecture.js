import api from '../../../utils/api'

const getPublicLecturesService = () => {
  return api.get('/lectures/public')
}

const getMyLecturesService = () => {
  return api.get('/lectures')
}

export {getPublicLecturesService, getMyLecturesService}