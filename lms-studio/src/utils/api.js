import axios from 'axios'

const api = axios.create({
  baseURL: 'https://ax8w57g1dk.execute-api.ap-southeast-1.amazonaws.com/newenv'
})

export default api