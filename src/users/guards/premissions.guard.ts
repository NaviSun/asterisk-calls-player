import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ActiveUserData } from '../../auth/interface/JwtPayload.interface';
import { REQUEST_USER_KEY } from '../../auth/auth.constants';
import { PREMISSION_KEY } from 'src/auth/decorators/premissions.decorator';
import { PremissionType } from 'src/auth/premission.type';


@Injectable()
export class PremissionGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const contextPremissions = this.reflector.getAllAndOverride<PremissionType[]>(PREMISSION_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (!contextPremissions) {
      return true;
    }
    const user: ActiveUserData = context.switchToHttp().getRequest()[
      REQUEST_USER_KEY
    ];
    return contextPremissions.every((premission) => user.premission?.includes(premission))
  }
}
