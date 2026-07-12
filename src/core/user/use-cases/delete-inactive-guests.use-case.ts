import { Inject, Injectable, Logger } from '@nestjs/common';
import { USER_REPOSITORY } from '../repositories/user.repository.interface';
import type { IUserRepository } from '../repositories/user.repository.interface';

@Injectable()
export class DeleteInactiveGuestsUseCase {
  private readonly logger = new Logger(DeleteInactiveGuestsUseCase.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(days: number = 7): Promise<number> {
    this.logger.log(`Starting cleanup for guest accounts inactive for more than ${days} days...`);
    const deletedCount = await this.userRepository.deleteInactiveGuestUsers(days);
    this.logger.log(`Successfully deleted ${deletedCount} inactive guest accounts.`);
    return deletedCount;
  }
}
