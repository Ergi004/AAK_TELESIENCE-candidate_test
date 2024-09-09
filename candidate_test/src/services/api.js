import axios from "./axios";

export const API = async () => {
  try {
    const response = await axios.get(
      "https://django-dev.aakscience.com/candidate_test/fronted"
    );
    return response.data;
  } catch (e) {
    console.error(e.message);
  }
};
