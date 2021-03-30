import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createAccount(
    createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    // check new user
    // verifiy password length
    // create user & hash password
    const { accountId } = createAccountInput;
    try {
      const exists = await this.userRepository.findOne({ accountId });

      if (exists) {
        return {
          isSucceeded: false,
          error: 'There is an user with that email already',
        };
      }

      await this.userRepository.save(
        this.userRepository.create({ ...createAccountInput }),
      );
      return {
        isSucceeded: true,
      };
    } catch (error) {
      console.log(error);

      return {
        isSucceeded: false,
        error: "Couldn't create an account",
      };
    }
  }
}
