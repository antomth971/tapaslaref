import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { RecaptchaService } from './recaptcha.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private recaptchaService: RecaptchaService,
  ) {}
  /**
   * Endpoint to handle user login.
   * @param signInDto - The data transfer object containing user credentials.
   * @returns An object containing the access token if login is successful, or an error message if not.
   */
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>) {
    const isValide = await this.authService.validateUser(
      signInDto.email,
      signInDto.password,
    );
    const result = await this.authService.login(
      isValide.isValid,
      isValide.user,
    );
    if (result) {
      return { access_token: result.access_token };
    } else {
      return { message: 'Invalid credentials' };
    }
  }

  /**
   * Endpoint to handle user registration.
   * @param signUpDto - The data transfer object containing user registration details.
   * @returns An object indicating whether the registration was successful or not.
   */
  @UseGuards(AuthGuard)
  @Post('checkIsLogin')
  async checkIsLogin(@Request() req) {
    return this.authService.checkIsLogin(req.user);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async signUp(@Body() signUpDto: Record<string, any>) {
    const isHuman = await this.recaptchaService.verifyToken(
      signUpDto.recaptchaToken,
    );

    if (!isHuman) {
      throw new UnauthorizedException(
        'reCAPTCHA verification failed. Please try again.',
      );
    }

    // Si la vérification réussit, créer le compte
    // Lance une ConflictException si l'email existe déjà
    await this.authService.register(signUpDto.email, signUpDto.password);

    return {
      message: 'Compte créé avec succès',
      success: true,
    };
  }
}
