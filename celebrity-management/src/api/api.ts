import axios from 'axios';
import { Celebrity } from '../components/types';

export const fetchCelebrities = async (): Promise<Celebrity[]> => {
  const response = await axios.get<Celebrity[]>('/data/celebrities.json');
  return response.data;
};