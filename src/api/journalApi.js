import axios from 'axios'

const journalApi = axios.create({
    baseURL: 'https://vue-journal-db6dc-default-rtdb.firebaseio.com'
})

export default journalApi