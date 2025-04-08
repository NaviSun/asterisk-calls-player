import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { UserResponse } from '../../users/dto/response.dto';
import { AuthenticationService } from './authentication.service';
import { SignInDto } from './dto/sign-in.dto/sign-in.dto';
import { Auth } from '../decorators/auth.decorator';
import { AuthType } from './enum/auth-type.enum';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Roles } from './../../users/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';
import { Premissions } from '../decorators/premissions.decorator';
import { Premission } from '../premission.type';




@ApiTags('Authentication')
@ApiBearerAuth()
@Controller('auth')
export class AuthenticationController {
    constructor(private readonly authService: AuthenticationService) { }
    // @Roles(UserRole.ADMIN)
    @Premissions(Premission.CreateUser)
    @Post('register')
    @ApiOperation({
        summary: 'Создание нового пользователя',
        description: 'Регистрирует нового пользователя в системе. Пароль будет захеширован перед сохранением.'
    })
    @ApiBody({
        type: CreateUserDto,
        examples: {
            basic: {
                summary: 'Базовый пример',
                value: {
                    firstName: 'Иван',
                    lastName: 'Иванов',
                    email: 'user@example.com',
                    password: 'securePassword123'
                }
            },
            admin: {
                summary: 'Создание администратора',
                value: {
                    firstName: 'Админ',
                    lastName: 'Системный',
                    email: 'admin@example.com',
                    password: 'adminPassword123',
                    role: 'admin'
                }
            }
        }
    })
    @ApiResponse({
        status: 201,
        description: 'Пользователь успешно создан',
        type: UserResponse
    })
    @ApiResponse({
        status: 400,
        description: 'Некорректные данные: невалидный email, короткий пароль и т.д.'
    })
    @ApiResponse({
        status: 409,
        description: 'Пользователь с таким email уже существует'
    })
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }


    @HttpCode(HttpStatus.OK)
    @Auth(AuthType.None)
    @Post('login')
    @ApiOperation({
        summary: 'Логин пользователя',
        description: 'Авторизация пользователя'
    })
    @ApiBody({
        type: SignInDto,
        examples: {
            basic: {
                summary: 'Базовый пример',
                value: {
                    email: 'user@example.com',
                    password: 'securePassword123'
                }
            },
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Successfully logged in',
    })
    async login(
        @Body() signInDto: SignInDto) {
        return await this.authService.login(signInDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('refresh-tokens')
    refreshTokens(@Body() refreshTokenDto: RefreshTokenDto){
        return this.authService.refreshTokens(refreshTokenDto)
    }

}
