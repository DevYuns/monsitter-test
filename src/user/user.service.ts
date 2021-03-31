<<<<<<< Updated upstream
=======
import {
  AddParentRoleOutput,
  AddParentRoleInput,
} from './dtos/add-parent-role.dto';
import { ChangePasswordOutput } from './dtos/change-password.dto';
import {
  UpdateProfileOutput,
  UpdateProfileInput,
} from './dtos/update-profile.dto';
import { UserProfileOutput } from './dtos/user-profile.dto';
>>>>>>> Stashed changes
import { JwtService } from './../jwt/jwt.service';
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
    private readonly jwtService: JwtService,
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
    try {
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

      const token = this.jwtService.sign({ id: user.id });

      return {
        isSucceeded: true,
        token,
      };
    } catch (error) {
      return {
        isSucceeded: false,
        error,
      };
    }
  }

  async findById(id: number): Promise<any> {
    const user = await this.userRepository.findOneOrFail({ id });
    return user;
  }

  async addParentRole(
    userId: number,
    addParentRoleInput: AddParentRoleInput,
  ): Promise<AddParentRoleOutput> {
    try {
      await this.userRepository.update(userId, {
        ...addParentRoleInput,
      });
    } catch (error) {
      return {
        isSucceeded: false,
        error,
      };
    }
  }
}
