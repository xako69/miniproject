import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

export const getFaculty = () => API.get("faculty/");
export const addFaculty = (faculty) => API.post("faculty/", faculty);
export const updateFaculty = (id, faculty) => API.put(`faculty/${id}/`, faculty);
export const deleteFaculty = (id) => API.delete(`faculty/${id}/`);
