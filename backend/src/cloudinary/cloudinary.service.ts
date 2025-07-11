import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class CloudinaryService {
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly cloudName: string;

  constructor(private configService: ConfigService) {
    this.cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    this.apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    this.apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');
  }

  async listMedia(): Promise<any[]> {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${this.cloudName}/resources/search`,
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
}
