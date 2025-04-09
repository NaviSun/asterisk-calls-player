import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_USER_KEY } from '../auth.constants';
import { ActiveUserData } from '../interface/active_user_data_jwt.interface';

export const ActiveUser = createParamDecorator(
    (field: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user: ActiveUserData | undefined = request[REQUEST_USER_KEY]
        return field ? user?.[field] : user
    }
)