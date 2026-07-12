import { DeleteInactiveGuestsUseCase } from './delete-inactive-guests.use-case';
import { IUserRepository } from '../repositories/user.repository.interface';

describe('DeleteInactiveGuestsUseCase', () => {
  let useCase: DeleteInactiveGuestsUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findTop500Users: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteInactiveGuestUsers: jest.fn(),
    };
    useCase = new DeleteInactiveGuestsUseCase(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should call repository to delete inactive guests and return count', async () => {
      // Arrange
      mockUserRepository.deleteInactiveGuestUsers.mockResolvedValue(42);

      // Act
      const result = await useCase.execute(7);

      // Assert
      expect(mockUserRepository.deleteInactiveGuestUsers).toHaveBeenCalledWith(7);
      expect(result).toBe(42);
    });

    it('should use default 7 days if no parameter is passed', async () => {
      // Arrange
      mockUserRepository.deleteInactiveGuestUsers.mockResolvedValue(0);

      // Act
      await useCase.execute();

      // Assert
      expect(mockUserRepository.deleteInactiveGuestUsers).toHaveBeenCalledWith(7);
    });
  });
});
