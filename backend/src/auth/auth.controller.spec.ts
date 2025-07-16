import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;

  const authService = {
    validateUser: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
    checkIsLogin: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: AuthGuard, useValue: mockGuard },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should return access token on valid credentials', async () => {
      authService.validateUser.mockResolvedValue({
        isValid: true,
        user: { id: 1, email: 'user@test.com' },
      });
      authService.login.mockResolvedValue({ access_token: 'jwt.token' });

      const result = await controller.signIn({
        email: 'user@test.com',
        password: 'password',
      });
      expect(result).toEqual({ access_token: 'jwt.token' });
    });

    it('should return error message on invalid credentials', async () => {
      authService.validateUser.mockResolvedValue({
        isValid: false,
        user: null,
      });
      authService.login.mockResolvedValue(null);

      const result = await controller.signIn({
        email: 'user@test.com',
        password: 'wrongpass',
      });
      expect(result).toEqual({ message: 'Invalid credentials' });
    });
  });

  describe('signUp', () => {
    it('should return message: true when registration is successful', async () => {
      authService.register.mockResolvedValue(true);

      const result = await controller.signUp({
        email: 'new@user.com',
        password: '123456',
      });
      expect(result).toEqual({ message: true });
    });

    it('should return message: false when registration fails', async () => {
      authService.register.mockResolvedValue(false);

      const result = await controller.signUp({
        email: 'existing@user.com',
        password: '123456',
      });
      expect(result).toEqual({ message: false });
    });
  });

  describe('checkIsLogin', () => {
    it('should return isLoggedIn: true when user is present in request', async () => {
      authService.checkIsLogin.mockResolvedValue({ isLoggedIn: true });

      const mockRequest = { user: { id: 1, email: 'user@test.com' } };

      const result = await controller.checkIsLogin(mockRequest);
      expect(result).toEqual({ isLoggedIn: true });
    });

    it('should return isLoggedIn: false when user is null', async () => {
      authService.checkIsLogin.mockResolvedValue({ isLoggedIn: false });

      const mockRequest = { user: null };

      const result = await controller.checkIsLogin(mockRequest);
      expect(result).toEqual({ isLoggedIn: false });
    });
  });
});
