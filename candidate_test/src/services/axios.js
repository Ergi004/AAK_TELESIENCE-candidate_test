import axios from "axios";
const instance = axios.create({
  baseURL: "https://django-dev.aakscience.com/candidate_test/fronted",
});
export default instance;
