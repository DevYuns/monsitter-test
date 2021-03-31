import { Role } from './../auth/role.decorator';
import {
  AddParentRoleInput,
  AddParentRoleOutput,
} from './dtos/add-parent-role.dto';
import {
  ChangePasswordOutput,
  ChangePasswordInput,
} from './dtos/change-password.dto';
import {
  UpdateProfileOutput,
  UpdateProfileInput,
} from './dtos/update-profile.dto';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { AuthUser } from './../auth/auth-user.decorator';
import { AuthGuard } from './../auth/auth.guard';
import { LoginOutput, LoginInput } from './dtos/login.dto';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { UserService } from './user.service';
import { User, UserRole } from './entities/user.entity';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @Role(['Any'])
  me(@AuthUser() authUser: User) {
    return authUser;
  }

  @Query(() => UserProfileOutput)
  @Role(['Any'])
  async userProfile(
    @Args() userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    return this.userService.findById(userProfileInput.userId);
  }

  @Mutation(() => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.userService.createAccount(createAccountInput);
  }

  @Mutation(() => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.userService.login(loginInput);
  }

  @Mutation(() => UpdateProfileOutput)
  @Role(['Any'])
  async updateProfile(
    @AuthUser() authUser: User,
    @Args('input') editProfileInput: UpdateProfileInput,
  ): Promise<UpdateProfileOutput> {
    return this.userService.updateProfile(authUser.id, editProfileInput);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => ChangePasswordOutput)
  async changePassword(
    @AuthUser() authUser: User,
    @Args('input') { password }: ChangePasswordInput,
  ): Promise<ChangePasswordOutput> {
    return this.userService.changePassword(authUser.id, password);
  }

  @Mutation(() => AddParentRoleOutput)
  @Role([UserRole.SITTER])
  async addParentRole(
    @AuthUser() authUser: User,
    @Args('input') addParentRoleInput: AddParentRoleInput,
  ): Promise<AddParentRoleOutput> {
    return this.userService.addParentRole(authUser.id, addParentRoleInput);
  }
}
