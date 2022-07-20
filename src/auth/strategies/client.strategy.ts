import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from "../auth.service";

@Injectable()
export class ClientStrategy extends PassportStrategy(Strategy, 'clientStrategy') {
    constructor(private authService: AuthService) {
        super({ usernameField: 'email' });
    }

    async validate(email: string, password: string) {
        const client = await this.authService.validateClient(email, password);
        if(!client) {
            throw new UnauthorizedException();
        }
        return client;
    }
}