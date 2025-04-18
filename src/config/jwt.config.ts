import { registerAs } from "@nestjs/config";


export default registerAs('jwt', () => {
    return {
        secret: process.env.JWT_SECRET_KEY,
        audience: process.env.JWT_TOKEN_AUDIENCE,
        issuer: process.env.JWT_TOKEN_ISSUER,
        accesTokenTtl: parseInt(process.env.JWT_TOKEN_ACCESS_TTL ?? '3600', 10),
        refreshTokenTtl: parseInt(process.env.JWT_REFRESH_TOKEN_TTL ?? '86400', 10),
    }
})

