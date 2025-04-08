import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { DeepPartial, Repository } from 'typeorm';
import { HashingService } from '../hashing/hashing.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserRole } from '../../users/enums/user-role.enum';
import { SignInDto } from './dto/sign-in.dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { ActiveUserData } from '../interface/JwtPayload.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { InvalidateRefreshTokenError, RefreshTokenIdsStorage } from './refresh-token-ids.storage/refresh-token-ids.storage';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthenticationService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly hashingService: HashingService,
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly refreshTokenIsStorage: RefreshTokenIdsStorage
    ) { }

    private getValidRole(role?: string): UserRole {
        if (role && Object.values(UserRole).includes(role as UserRole)) {
            return role as UserRole;
        }
        return UserRole.USER;
    }


    async register(signUpDto: CreateUserDto): Promise<UserEntity | undefined> {
        try {
            const { email, password, ...rest } = signUpDto;

            const existingUser = await this.userRepository.findOneBy({ email });
            if (existingUser) {
                throw new ConflictException('User with this email already exists');
            }

            const passwordHash = await this.hashingService.hash(signUpDto.password)

            const userData: DeepPartial<UserEntity> = {
                ...rest,
                email,
                passwordHash,
                role: this.getValidRole(signUpDto.role),
                premissions: [],
                banned: false,
                banReason: '',
                avatar: '',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            const user = this.userRepository.create(userData);


            return await this.userRepository.save(user);
        } catch (error) {
            const pgUniqueViolationErrorCode = '23505'
            if (error.code === pgUniqueViolationErrorCode) {
                throw new ConflictException("Не возможно создать пользователя");
            }
            throw error;
        }

    }

    async login(signInDto: SignInDto) {
        const user = await this.userRepository.findOneBy({
            email: signInDto.email,
        })
        if (!user) {
            throw new UnauthorizedException('Пользователь не существует');
        }
        const isEqual = await this.hashingService.compare(signInDto.password, user.passwordHash);

        if (!isEqual) {
            throw new UnauthorizedException('Имя пользователя или пароль не совпадают')
        }

        return await this.generateTokens(user);
    }

    async generateTokens(user: UserEntity) {
        const refreshTokenId = randomUUID();
        const [accesToken, refreshToken] = await Promise.all([
            this.signToken<Partial<ActiveUserData>>(
                user.id,
                this.jwtConfiguration.accesTokenTtl,
                {
                    email: user.email,
                    role: user.role,
                    firstName: user.firstName,
                    premission: user.premissions 
                }),
            this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
                refreshTokenId
            }),
        ]);
        await this.refreshTokenIsStorage.insert(user.id, refreshTokenId);
        return { accesToken, refreshToken };
    }

    async refreshTokens(refreshTokenDto: RefreshTokenDto) {
        try {
            const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
                Pick<ActiveUserData, 'sub'> & { refreshTokenId: string }>
                (refreshTokenDto.refreshToken, {
                    audience: this.jwtConfiguration.audience,
                    issuer: this.jwtConfiguration.issuer,
                    secret: this.jwtConfiguration.secret,
                });
            const user = await this.userRepository.findOneByOrFail({
                id: sub,
            });
            const isValid = await this.refreshTokenIsStorage.validate(user.id, refreshTokenId)
            if (isValid) {
                await this.refreshTokenIsStorage.invalidate(user.id)
            } else {
                throw new Error('Refresh token is invalid');
            }
            return await this.generateTokens(user)
        } catch (error) {
            if (error instanceof InvalidateRefreshTokenError) {
                throw new UnauthorizedException('Доступ запрещен')
            }
            throw new UnauthorizedException('Вы не Авторизованы 3')
        }

    }

    private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
        return await this.jwtService.signAsync(
            {
                sub: userId,
                ...payload
            } as ActiveUserData,
            {
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
                secret: this.jwtConfiguration.secret,
                expiresIn: this.jwtConfiguration.accesTokenTtl,
            },
        );
    }
}
