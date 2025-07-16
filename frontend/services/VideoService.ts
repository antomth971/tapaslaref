import axios from 'axios';
import getConfig from '@/constants/config';

const API_URL = process.env.EXPO_PUBLIC_API_URL as string;

export async function getAllVideos(page = 1, limit = 15) {
  const config = await getConfig();
  try {
    const response = await axios.get(`${API_URL}/video/all?page=${page}&limit=${limit}`, config);
    return response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des vidéos', error);
    throw error;
  }
}

export async function getCloudinaryMedia() {
  const config = await getConfig();
  try {
    const response = await axios.get(`${API_URL}/cloudinary/media`, config);
    return response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des médias Cloudinary', error);
    throw error;
  }
}

export async function getVideoById(id: string) {
  const config = await getConfig();
  try {
    const response = await axios.get(`${API_URL}/video/${id}`, config);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors du chargement de la vidéo avec l'ID ${id}`, error);
    throw error;
  }
}