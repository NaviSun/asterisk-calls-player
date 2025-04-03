import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { AudioFileEntity } from "src/audiofiles/entities/files.entities";

export const getDbConfig = (configService: ConfigService): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> => {
    return {
        type: 'postgres',
        host: configService.get<string>('HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DATABASE'),
        entities: [AudioFileEntity],
        synchronize: true,
    }
}