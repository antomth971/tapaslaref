import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RecaptchaService {
  private readonly secretKey: string;

  constructor() {
    this.secretKey = process.env.RECAPTCHA_SECRET_KEY || '';
  }

  async verifyToken(token: string): Promise<boolean> {
    if (!token) {
      throw new UnauthorizedException('reCAPTCHA token is required');
    }

    if (!this.secretKey) {
      console.warn('RECAPTCHA_SECRET_KEY is not configured');
      if (process.env.NODE_ENV === 'development') {
        return true;
      }
      throw new UnauthorizedException('reCAPTCHA is not configured');
    }

    try {
      const response = await axios.post(
        'https://www.google.com/recaptcha/api/siteverify',
        null,
        {
          params: {
            secret: this.secretKey,
            response: token,
          },
        },
      );

      const { success, score, 'error-codes': errorCodes } = response.data;
      
      // Vérification reCAPTCHA v3 (avec score)
      if (score !== undefined) {
        // Score > 0.5 = probablement humain
        if (success && score >= 0.5) {
          return true;
        }
        console.warn('reCAPTCHA v3 verification failed:', {
          success,
          score,
          errorCodes,
        });
        return false;
      }

      // Vérification reCAPTCHA v2 (checkbox, pas de score)
      if (success) {
        return true;
      }

      console.warn('reCAPTCHA v2 verification failed:', {
        success,
        errorCodes,
      });
      return false;
    } catch (error) {
      console.error('Error verifying reCAPTCHA:', error);
      throw new UnauthorizedException('Failed to verify reCAPTCHA');
    }
  }
}
