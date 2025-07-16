import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../database/entity/user.entity';
import { hash, compare } from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userService: Partial<Record<keyof UserService, jest.Mock>>;
  let jwtService: Partial<Record<keyof JwtService, jest.Mock>>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
  } as User;

  beforeEach(async () => {
    userService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return isValid true and user when credentials match', async () => {
      userService.findByEmail.mockResolvedValue(mockUser);
      (compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toEqual({ isValid: true, user: mockUser });
    });

    it('should return isValid false and null user if password mismatch', async () => {
      userService.findByEmail.mockResolvedValue(mockUser);
      (compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser(
        'test@example.com',
        'wrongpass',
      );
      expect(result).toEqual({ isValid: false, user: null });
    });

    it('should return isValid false and null user if user not found', async () => {
      userService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser(
        'unknown@example.com',
        'password',
      );
      expect(result).toEqual({ isValid: false, user: null });
    });
  });

  describe('login', () => {
    it('should return access token when valid', async () => {
      jwtService.sign.mockReturnValue('jwt.token');
      const result = await service.login(true, mockUser);
      expect(result).toEqual({ access_token: 'jwt.token' });
    });

    it('should return null when not valid', async () => {
      const result = await service.login(false, mockUser);
      expect(result).toBeNull();
    });
  });

  describe('checkIsLogin', () => {
    it('should return true if user is defined', async () => {
      const result = await service.checkIsLogin(mockUser);
      expect(result).toEqual({ isLoggedIn: true });
    });

    it('should return false if user is null', async () => {
      const result = await service.checkIsLogin(null);
      expect(result).toEqual({ isLoggedIn: false });
    });
  });

  describe('register', () => {
    it('should return false if user already exists', async () => {
      userService.findByEmail.mockResolvedValue(mockUser);

      const result = await service.register('test@example.com', 'password');
      expect(result).toBe(false);
    });

    it('should hash password and create new user', async () => {
      userService.findByEmail.mockResolvedValue(null);
      (hash as jest.Mock).mockResolvedValue('hashedPassword');
      userService.create.mockResolvedValue(mockUser);

      const result = await service.register('test@example.com', 'password');
      expect(hash).toHaveBeenCalledWith('password', 10);
      expect(userService.create).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if create fails', async () => {
      userService.findByEmail.mockResolvedValue(null);
      (hash as jest.Mock).mockResolvedValue('hashedPassword');
      userService.create.mockResolvedValue(null);

      const result = await service.register('test@example.com', 'password');
      expect(result).toBe(false);
    });
  });
});
