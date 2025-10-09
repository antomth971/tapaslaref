import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';
import * as FormData from 'form-data';

export enum ModerationType {
  MANUAL = 'manual',
  AWS_REKOGNITION = 'aws_rek', // Images
  AWS_REKOGNITION_VIDEO = 'aws_rek_video', // Vidéos
  WEBPURIFY = 'webpurify', // Images
  GOOGLE_VIDEO = 'google_video_moderation', // Vidéos
  PERCEPTION_POINT = 'perception_point', // Malware
}

export enum ModerationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  QUEUED = 'queued',
  ABORTED = 'aborted',
}

export interface UploadOptions {
  folder?: string;
  public_id?: string;
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
  moderation?: ModerationType | ModerationType[] | string;
  notification_url?: string;
  tags?: string[];
  overwrite?: boolean;
  unique_filename?: boolean;
  filename?: string;
  mimetype?: string;
}

@Injectable()
export class CloudinaryService {
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly cloudName: string;
  private readonly uploadUrl: string;

  constructor(private configService: ConfigService) {
    this.cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    this.apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    this.apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');
    this.uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}`;
  }

  /**
   * Liste tous les médias (images et vidéos)
   */
  async listMedia(): Promise<any[]> {
    const response = await axios.post(
      `${this.uploadUrl}/resources/search`,
      {
        expression: 'resource_type:(image OR video)',
        max_results: 50,
      },
      {
        auth: {
          username: this.apiKey,
          password: this.apiSecret,
        },
      },
    );

    return response.data.resources;
  }

  /**
   * Upload un fichier avec options de modération
   * @param file - Buffer ou chemin du fichier
   * @param options - Options d'upload incluant la modération
   */
  async uploadAsset(
    file: Buffer | string,
    options: UploadOptions = {},
  ): Promise<any> {
    const resourceType = options.resource_type || 'auto';
    const timestamp = Math.round(Date.now() / 1000);

    const { filename, mimetype, ...cloudinaryOptions } = options;

    const params: any = {
      timestamp,
      ...cloudinaryOptions,
    };

    if (Array.isArray(params.moderation)) {
      params.moderation = params.moderation.join('|');
    }

    if (params.tags && Array.isArray(params.tags)) {
      params.tags = params.tags.join(',');
    }

    delete params.resource_type;

    // Générer la signature
    const signature = this.generateSignature(params);

    const formData = new FormData();

    if (Buffer.isBuffer(file)) {
      formData.append('file', file, {
        filename: filename || 'upload',
        contentType: mimetype || 'application/octet-stream',
      });
    } else {
      formData.append('file', file);
    }

    formData.append('api_key', this.apiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);

    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && key !== 'file') {
        formData.append(key, params[key].toString());
      }
    });

    try {
      const response = await axios.post(
        `${this.uploadUrl}/${resourceType}/upload`,
        formData,
        {
          headers: formData.getHeaders(),
        },
      );

      return response.data;
    } catch (error) {
      throw new Error(
        `Erreur lors de l'upload: ${error.response?.data?.error?.message || error.message}`,
      );
    }
  }

  /**
   * Supprime un asset par son public_id
   * @param publicId - L'identifiant public de l'asset
   * @param resourceType - Type de ressource (image, video, raw)
   */
  async deleteAsset(
    publicId: string,
    resourceType: 'image' | 'video' | 'raw' = 'image',
  ): Promise<any> {
    const timestamp = Math.round(Date.now() / 1000);

    const params = {
      public_id: publicId,
      timestamp,
    };

    const signature = this.generateSignature(params);

    try {
      const response = await axios.post(
        `${this.uploadUrl}/${resourceType}/destroy`,
        {
          ...params,
          api_key: this.apiKey,
          signature,
        },
      );

      return response.data;
    } catch (error) {
      throw new Error(
        `Erreur lors de la suppression: ${error.response?.data?.error?.message || error.message}`,
      );
    }
  }

  /**
   * Supprime plusieurs assets en une seule fois (Admin API)
   * @param publicIds - Liste des identifiants publics
   * @param resourceType - Type de ressource
   */
  async deleteMultipleAssets(
    publicIds: string[],
    resourceType: 'image' | 'video' | 'raw' = 'image',
  ): Promise<any> {
    try {
      const response = await axios.delete(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/resources/${resourceType}/upload`,
        {
          params: {
            public_ids: publicIds,
          },
          auth: {
            username: this.apiKey,
            password: this.apiSecret,
          },
        },
      );

      return response.data;
    } catch (error) {
      throw new Error(
        `Erreur lors de la suppression multiple: ${error.response?.data?.error?.message || error.message}`,
      );
    }
  }

  /**
   * Liste les assets en attente de modération
   * @param moderationType - Type de modération
   * @param status - Statut de modération
   */
  async listModeratedAssets(
    moderationType: ModerationType,
    status: ModerationStatus = ModerationStatus.PENDING,
  ): Promise<any> {
    try {
      const response = await axios.get(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/resources/image/moderations/${moderationType}/${status}`,
        {
          auth: {
            username: this.apiKey,
            password: this.apiSecret,
          },
        },
      );

      return response.data.resources;
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des assets modérés: ${error.response?.data?.error?.message || error.message}`,
      );
    }
  }

  /**
   * Approuve ou rejette manuellement un asset modéré
   * @param publicId - L'identifiant public de l'asset
   * @param status - 'approved' ou 'rejected'
   */
  async updateModerationStatus(
    publicId: string,
    status: 'approved' | 'rejected',
  ): Promise<any> {
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/resources/image/upload/update`,
        {
          public_ids: [publicId],
          moderation_status: status,
        },
        {
          auth: {
            username: this.apiKey,
            password: this.apiSecret,
          },
        },
      );

      return response.data;
    } catch (error) {
      throw new Error(
        `Erreur lors de la mise à jour du statut de modération: ${error.response?.data?.error?.message || error.message}`,
      );
    }
  }

  /**
   * Demande une modération pour un asset déjà uploadé
   * @param publicId - L'identifiant public de l'asset
   * @param moderationType - Type de modération à appliquer
   */
  async requestModerationForExistingAsset(
    publicId: string,
    moderationType: ModerationType | string,
  ): Promise<any> {
    const timestamp = Math.round(Date.now() / 1000);

    const params = {
      public_id: publicId,
      moderation: moderationType,
      timestamp,
      type: 'upload',
    };

    const signature = this.generateSignature(params);

    try {
      const response = await axios.post(
        `${this.uploadUrl}/image/explicit`,
        {
          ...params,
          api_key: this.apiKey,
          signature,
        },
      );

      return response.data;
    } catch (error) {
      throw new Error(
        `Erreur lors de la demande de modération: ${error.response?.data?.error?.message || error.message}`,
      );
    }
  }

  /**
   * Génère une signature pour authentifier les requêtes Cloudinary
   * @param params - Paramètres à signer
   */
  private generateSignature(params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .filter((key) => params[key] !== undefined && params[key] !== '')
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join('&');

    return crypto
      .createHash('sha256')
      .update(sortedParams + this.apiSecret)
      .digest('hex');
  }

  /**
   * Récupère les détails d'un asset incluant son statut de modération
   * @param publicId - L'identifiant public de l'asset
   * @param resourceType - Type de ressource
   */
  async getAssetDetails(
    publicId: string,
    resourceType: 'image' | 'video' | 'raw' = 'image',
  ): Promise<any> {
    try {
      const response = await axios.get(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/resources/${resourceType}/upload/${publicId}`,
        {
          auth: {
            username: this.apiKey,
            password: this.apiSecret,
          },
        },
      );

      return response.data;
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des détails: ${error.response?.data?.error?.message || error.message}`,
      );
    }
  }
}