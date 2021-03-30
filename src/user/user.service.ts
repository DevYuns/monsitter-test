import { LoginInput, LoginOutput } from './dtos/login.dto';
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

  async login(loginInput: LoginInput): Promise<LoginOutput> {
    // check if the password is correct
    // make a JWT token and give it to the user
    const { accountId, password } = loginInput;

    const user = await this.userRepository.findOne({ accountId });
    if (!user) {
      return {
        isSucceeded: false,
        error: 'User not found',
      };
    }

    const isPwdCorrect = await user.checkPassword(password);

    if (!isPwdCorrect) {
      return {
        isSucceeded: false,
        error: 'Wrong password',
      };
    }

    return {
      isSucceeded: true,
      token: 'dummy token',
    };

    try {
    } catch (error) {
      return {
        isSucceeded: false,
        error,
      };
    }
  }
}
