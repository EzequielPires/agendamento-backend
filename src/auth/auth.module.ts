import { Module } from "@nestjs/common";
import { JwtModule } from '@nestjs/jwt';
import { ClientModule } from "src/https/client/client.module";
import { UserModule } from "src/https/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ClientStrategy } from "./strategies/client.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
    imports: [
        ClientModule,
        UserModule,
        JwtModule.register({
            privateKey: 'YXNkY2RrZnVlYmFzamJkYXNsa2ZmZHNoZ3BvamFzZGZqaWhhb2RpamZpYWJzZGZpam5zYWRrbA==',
            signOptions: { expiresIn: '86400s' },
        })
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
        ClientStrategy,
        LocalStrategy
    ],
    exports: []
}) export class AuthModule { }