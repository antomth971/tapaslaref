import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    /**
     * Endpoint to handle user login.
     * @param signInDto - The data transfer object containing user credentials.
     * @returns An object containing the access token if login is successful, or an error message if not.
     */
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: Record<string, any>) {
        const isValide = await this.authService.validateUser(signInDto.email, signInDto.password);
        const result = await this.authService.login(isValide.isValid, isValide.user);
        if (result) {
            return { access_token: result.access_token };
        } else {
            return { message: 'Invalid credentials' };
        }
    }
    /**
     * Endpoint to get the profile of the authenticated user.
     * @param req - The request object containing user information.
     * @returns The username of the authenticated user.
     * just a test to see if the user is authenticated
     */
    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        console.log('req.user', req.user);
        return req.user;
    }

    @UseGuards(AuthGuard)
    @Post('checkIsLogin')
    async checkIsLogin(@Request() req) {
        return this.authService.checkIsLogin(req.user);
    }
}