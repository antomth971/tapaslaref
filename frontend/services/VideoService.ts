import axios from 'axios';
import getConfig from '@/constants/config'

const API_URL=process.env.EXPO_PUBLIC_API_URL as string

async function getCloudinaryMedia() {
    const config = await getConfig();
  try {
    const response = await axios.get(`${API_URL}/cloudinary/media`, config);
    return response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des médias Cloudinary', error);
    throw error;
  }
}

async function getAllVideos() {
    const config = await getConfig();
  try {
    const response = await axios.get(`${API_URL}/video/all`, config);
    return response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des vidéos', error);
    throw error;
  }
}

export { getCloudinaryMedia, getAllVideos };