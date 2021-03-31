import { User } from './../user/entities/user.entity';
import { AllowedRoles } from './role.decorator';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    const assignedRoles = this.reflector.get<AllowedRoles>(
      'assignedRoles',
      context.getHandler(),
    );

    if (!assignedRoles) {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user: User = gqlContext['user'];
    if (!user) {
      return false;
    }

    if (assignedRoles.includes('Any')) return true;

    const convertedArr = [];
    for (const x of user.roles) {
      convertedArr.push(x);
    }

    for (const elm of assignedRoles) {
      if (convertedArr.includes(elm)) {
        return true;
      }
    }

    return false;
  }
}
