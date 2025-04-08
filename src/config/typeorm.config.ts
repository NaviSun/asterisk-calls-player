import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { AudioFileEntity } from "../audiofiles/entities/files.entities";
import { UserEntity } from "../users/entities/user.entity";

export const getDbConfig = (configService: ConfigService): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> => {
    return {
        type: 'postgres',
        host: configService.get<string>('HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DATABASE'),
        entities: [AudioFileEntity, UserEntity],
        autoLoadEntities: true,
        synchronize: true,
    }
}