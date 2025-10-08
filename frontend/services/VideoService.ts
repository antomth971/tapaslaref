import axios from 'axios';
import getConfig from '@/constants/config';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';

const API_URL = process.env.EXPO_PUBLIC_API_URL as string;

export type PickerAsset = DocumentPicker.DocumentPickerAsset;
export type NativeUploadResult = { status: number; body: string };

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

export async function uploadAssetsWeb(
  assets: PickerAsset[],
  onTotalProgress: (p: number) => void,
  endpoint: string = `${API_URL}/video/upload`
): Promise<string[]> {
  const config = await getConfig();
  const authHeader = (config?.headers?.Authorization ?? '') as string;

  const total = assets.reduce((s, a) => s + (a.size ?? 0), 0) || 1;
  let uploadedBytes = 0;
  const results: string[] = [];

  for (const a of assets) {
    const file: File =
      (a as PickerAsset & { file?: File }).file ??
      new File([await (await fetch(a.uri)).blob()], a.name ?? 'file', {
        type: a.mimeType ?? 'application/octet-stream',
      });

    const resText: string = await new Promise((resolve, reject) => {
      const form = new FormData();
      form.append('file', file, file.name);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', endpoint);
      if (authHeader) xhr.setRequestHeader('Authorization', authHeader);

      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable) {
          const current = Math.min(evt.loaded / evt.total, 1);
          onTotalProgress((uploadedBytes + current * file.size) / total);
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          uploadedBytes += file.size;
          onTotalProgress(uploadedBytes / total);
          resolve(xhr.responseText ?? '');
        } else {
          reject(new Error(`HTTP ${xhr.status}`));
        }
      };
      xhr.onerror = () => reject(new Error('Network error'));
      xhr.send(form);
    });

    results.push(resText);
  }

  return results;
}

export async function uploadAssetsNative(
  assets: PickerAsset[],
  onTotalProgress: (p: number) => void,
  endpoint: string = `${API_URL}/video/upload`
): Promise<NativeUploadResult[]> {
  const config = await getConfig();
  const authHeader = (config?.headers?.Authorization ?? '') as string;

  const total = assets.reduce((s, a) => s + (a.size ?? 0), 0) || 1;
  let uploadedBytes = 0;
  const results: NativeUploadResult[] = [];

  for (const a of assets) {
    const fileSize = a.size ?? 0;

    const onProgress: FileSystem.FileSystemNetworkTaskProgressCallback<FileSystem.UploadProgressData> =
      ({ totalBytesSent, totalBytesExpectedToSend }) => {
        const denom =
          totalBytesExpectedToSend && totalBytesExpectedToSend > 0
            ? totalBytesExpectedToSend
            : fileSize || 1;
        const current = Math.min(totalBytesSent / denom, 1);
        onTotalProgress((uploadedBytes + current * denom) / total);
      };

    const task = FileSystem.createUploadTask(
      endpoint,
      a.uri,
      {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: 'file',
        mimeType: a.mimeType,
        headers: {
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        sessionType: FileSystem.FileSystemSessionType.BACKGROUND,
      },
      onProgress
    );

    const res = await task.uploadAsync();
    if (res?.status == null) {
      throw new Error('No response from server');
      
    }
    if (res.status < 200 || res.status >= 300) {
      throw new Error(`HTTP ${res.status}`);
    }

    uploadedBytes += fileSize;
    onTotalProgress(uploadedBytes / total);
    results.push({ status: res.status, body: res.body });
  }

  return results;
}

export async function uploadAssets(
  assets: PickerAsset[],
  onTotalProgress: (p: number) => void,
) {
  const url = `${API_URL}/video/upload`;
  if (Platform.OS === 'web') return uploadAssetsWeb(assets, onTotalProgress, url);
  return uploadAssetsNative(assets, onTotalProgress, url);
}

export function formatBytes(bytes?: number): string {
  if (!bytes) return '0 B';
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'] as const;
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i] ?? 'B'}`;
}