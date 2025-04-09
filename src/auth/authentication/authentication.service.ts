import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './../../users/entities/user.entity';
import { DeepPartial, Repository } from 'typeorm';
import { HashingService } from '../hashing/hashing.service';
import { CreateUserDto } from './../../users/dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { ActiveUserData } from '../interface/active_user_data_jwt.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { InvalidateRefreshTokenError, RefreshTokenIdsStorage } from './refresh-token-ids.storage/refresh-token-ids.storage';
import { randomUUID } from 'crypto';
import { RoleEntity } from './../../role/entity/role.entity';


@Injectable()
export class AuthenticationService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(RoleEntity)
        private readonly roleRepository: Repository<RoleEntity>,
        private readonly hashingService: HashingService,
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly refreshTokenIsStorage: RefreshTokenIdsStorage
    ) { }

    async register(signUpDto: CreateUserDto): Promise<UserEntity | undefined> {
        try {
            const { email, password, ...rest } = signUpDto;
            const existingUser = await this.userRepository.findOneBy({ email });
            if (existingUser) {
                throw new ConflictException('User with this email already exists');
            }
            const defaultRole = await this.roleRepository.findOneBy({ id: 2 });
            if (!defaultRole) {
                throw new ConflictException('Default role not found');
            }
            const passwordHash = await this.hashingService.hash(signUpDto.password)
            const userData: DeepPartial<UserEntity> = {
                ...rest,
                email,
                passwordHash,
                roles: [defaultRole],
                banned: false,
                banReason: '',
                avatar: '',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            const user = this.userRepository.create(userData);
            // Сохраняем пользователя и связи
            const savedUser = await this.userRepository.save(user);
            return savedUser;
        } catch (error) {
            const pgUniqueViolationErrorCode = '23505'
            if (error.code === pgUniqueViolationErrorCode) {
                throw new ConflictException("Не возможно создать пользователя");
            }
            throw error;
        }
    }

    async login(signInDto: SignInDto) {
        const user = await this.userRepository.findOne({
            where: { email: signInDto.email, },
            relations: ['roles', 'roles.permissions'],
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
        const permissions = [
            ...new Set(
                user.roles.flatMap((role) =>
                    role.permissions.map((p) => p.permission)
                )
            ),
        ];
        const refreshTokenId = randomUUID();
        const [accessToken, refreshToken] = await Promise.all([
            this.signToken<Partial<ActiveUserData>>(
                user.id,
                this.jwtConfiguration.accesTokenTtl,
                {
                    email: user.email,
                    firstName: user.firstName,
                    premission: permissions
                }),
            this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
                refreshTokenId
            }),
        ]);
        await this.refreshTokenIsStorage.insert(user.id, refreshTokenId);
        return { accessToken, refreshToken };
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
            const user = await this.userRepository.findOne({
                where: { id: sub, },
                relations: ['roles', 'roles.permission'],
            })

            if (!user) {
                throw new UnauthorizedException('Пользователь не существует');
            }

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
