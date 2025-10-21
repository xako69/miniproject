import axios from 'axios';

const API_ROOT = 'http://127.0.0.1:8000/api/';

export const api = axios.create({
  baseURL: API_ROOT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// endpoints
export const getFaculties = () => api.get('faculty/');
export const getSubjects = () => api.get('subjects/');
export const getClasses = () => api.get('classes/');
export const getTimetable = () => api.get('timetable/');
export const createTimetableEntry = (payload) => api.post('timetable/', payload);
export const updateTimetableEntry = (id, payload) => api.put(`timetable/${id}/`, payload);
export const deleteTimetableEntry = (id) => api.delete(`timetable/${id}/`);
