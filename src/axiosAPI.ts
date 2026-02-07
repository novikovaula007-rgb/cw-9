import axios from "axios"

export const axiosAPI = axios.create({
    baseURL: 'https://js-30-ulyana-default-rtdb.europe-west1.firebasedatabase.app/'
})