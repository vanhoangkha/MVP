import api from '../../../utils/api'

const getContentCatalogService = () => {
    // TODO: change to /contents
  return api.get('/lectures/public')
}

const putContentService = (jsonData) => {
    // TODO: change to /contents
  return api.put('/lectures', jsonData)
}

const getMyContentsService = () => {
    // TODO: change to /contents
  return api.get('/lectures')
}

export {getContentCatalogService, getMyContentsService, putContentService}