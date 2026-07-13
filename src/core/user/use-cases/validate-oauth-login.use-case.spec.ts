import { ValidateOAuthLoginUseCase, OAuthLoginCommand } from './validate-oauth-login.use-case';
import { IUserRepository } from '../repositories/user.repository.interface';
import { UserEntity, Role, Rank } from '../entities/user.entity';

describe('ValidateOAuthLoginUseCase', () => {
  let useCase: ValidateOAuthLoginUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findTop500Users: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      findByProviderId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteInactiveGuestUsers: jest.fn(),
    };
    useCase = new ValidateOAuthLoginUseCase(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return the existing user if providerId is already linked', async () => {
      // Arrange
      const existingUser = new UserEntity({ id: '1', providerId: 'google-123' } as any);
      mockUserRepository.findByProviderId.mockResolvedValue(existingUser);

      const command: OAuthLoginCommand = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        providerId: 'google-123',
        provider: 'google',
      };

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(mockUserRepository.findByProviderId).toHaveBeenCalledWith('google-123');
      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
      expect(mockUserRepository.create).not.toHaveBeenCalled();
      expect(result).toEqual(existingUser);
    });

    it('should link the provider to an existing user if email matches', async () => {
      // Arrange
      mockUserRepository.findByProviderId.mockResolvedValue(null);
      const existingUser = new UserEntity({ id: '2', email: 'test@example.com' } as any);
      mockUserRepository.findByEmail.mockResolvedValue(existingUser);
      
      const updatedUser = new UserEntity({ id: '2', email: 'test@example.com', provider: 'google', providerId: 'google-123' } as any);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      const command: OAuthLoginCommand = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        providerId: 'google-123',
        provider: 'google',
      };

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockUserRepository.update).toHaveBeenCalledWith('2', {
        provider: 'google',
        providerId: 'google-123',
      });
      expect(result).toEqual(updatedUser);
    });

    it('should create a new user with a generated unique username if email does not exist', async () => {
      // Arrange
      mockUserRepository.findByProviderId.mockResolvedValue(null);
      mockUserRepository.findByEmail.mockResolvedValue(null);
      
      // Simulate username 'test' is taken, but 'test1' is available
      mockUserRepository.findByUsername.mockImplementation(async (username: string) => {
        if (username === 'test') return new UserEntity({ id: '3' } as any);
        return null;
      });

      const newUser = new UserEntity({ id: '4', username: 'test1' } as any);
      mockUserRepository.create.mockResolvedValue(newUser);

      const command: OAuthLoginCommand = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        providerId: 'google-123',
        provider: 'google',
      };

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith('test');
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith('test1');
      expect(mockUserRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        email: 'test@example.com',
        username: 'test1',
        provider: 'google',
        providerId: 'google-123',
      }));
      expect(result).toEqual(newUser);
    });

    it('should create a new user using firstName and lastName if email is null', async () => {
      // Arrange
      mockUserRepository.findByProviderId.mockResolvedValue(null);
      mockUserRepository.findByUsername.mockResolvedValue(null);

      const newUser = new UserEntity({ id: '5', username: 'TestUser' } as any);
      mockUserRepository.create.mockResolvedValue(newUser);

      const command: OAuthLoginCommand = {
        email: null,
        firstName: 'Test',
        lastName: 'User',
        providerId: 'facebook-123',
        provider: 'facebook',
      };

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith('TestUser');
      expect(mockUserRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        email: undefined,
        username: 'TestUser',
        provider: 'facebook',
        providerId: 'facebook-123',
      }));
      expect(result).toEqual(newUser);
    });
  });
});
