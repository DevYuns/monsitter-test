import { Child } from './entities/child.entity';
import {
  CreateAccountOfSitterInput,
  CreateAccountOfSitterOutput,
} from './dtos/create-account-of-sitter.dto';
import {
  CreateAccountOfMomInput,
  CreateAccountOfMomOutput,
  ChildrenInput,
} from './dtos/create-account-of-mom.dto';
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
import { JwtService } from './../jwt/jwt.service';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Child)
    private readonly childRepository: Repository<Child>,
    private readonly jwtService: JwtService,
  ) {}

  async createAccountOfMom(
    createAccountOfMonInput: CreateAccountOfMomInput,
    childrenInput: ChildrenInput,
  ): Promise<CreateAccountOfMomOutput> {
    const { accountId, roles } = createAccountOfMonInput;
    try {
      const exists = await this.userRepository.findOne({ accountId });
      if (exists) {
        return {
          isSucceeded: false,
          error: 'There is an user with that email already',
        };
      }

      if (roles[0] !== 'PARENT') {
        return {
          isSucceeded: false,
          error: 'You should set your role to PARENT',
        };
      }
      const newUser = this.userRepository.create({
        ...createAccountOfMonInput,
      });
      await this.userRepository.save(newUser);

      const newChildren = this.childRepository.create({ ...childrenInput });
      newChildren.parent = newUser;

      await this.childRepository.save(newChildren);

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

  async createAccountOfSitter(
    createAccountOfSitterInput: CreateAccountOfSitterInput,
  ): Promise<CreateAccountOfSitterOutput> {
    const { accountId, roles } = createAccountOfSitterInput;
    try {
      const exists = await this.userRepository.findOne({ accountId });
      if (exists) {
        return {
          isSucceeded: false,
          error: 'There is an user with that email already',
        };
      }

      if (roles[0] !== 'SITTER') {
        return {
          isSucceeded: false,
          error: 'You should set your role to PARENT',
        };
      }

      await this.userRepository.save(
        this.userRepository.create({ ...createAccountOfSitterInput }),
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

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.userRepository.findOneOrFail({ id });
      return {
        isSucceeded: true,
        user,
      };
    } catch (error) {
      return {
        isSucceeded: false,
        error: 'User Not Found',
      };
    }
  }

  async updateProfile(
    userId: number,
    editProfileInput: UpdateProfileInput,
  ): Promise<UpdateProfileOutput> {
    try {
      await this.userRepository.update(userId, {
        ...editProfileInput,
      });
      return {
        isSucceeded: true,
      };
    } catch (error) {
      return {
        isSucceeded: false,
        error,
      };
    }
  }

  async changePassword(
    userId: number,
    password: string,
  ): Promise<ChangePasswordOutput> {
    try {
      const user = await this.userRepository.findOne(userId);
      user.password = password;
      await this.userRepository.save(user);

      return {
        isSucceeded: true,
      };
    } catch (error) {
      return {
        isSucceeded: false,
        error,
      };
    }
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
