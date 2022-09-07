import axios from 'axios';

const client =  axios.create({
  baseURL: `http://localhost:8000/api`,
  headers: {
    "Content-type": "application/json",
    "Accept": "application/json"
  }
});

export default client;
