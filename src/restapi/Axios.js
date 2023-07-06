import axios from 'axios';
import Config from '../utils/Config';


export default axios.create({
  baseURL: Config.BASE_URL,
  timeout: 5000,
});

