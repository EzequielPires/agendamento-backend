import { ClientService } from "src/https/client/client.service";
import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import { compareSync } from "bcrypt";
import { UserService } from "src/https/user/user.service";
import { User } from "src/entities/user.entity";

@Injectable()
export class AuthService {
    constructor(
        private readonly clientService: ClientService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async loginClient(client: any) {
        const payload = { sub: client.id, email: client.email, name: client.name };
        return {
            success: true,
            client: {
                id: client.id,
                email: client.email,
                name: client.name
            },
            token: this.jwtService.sign(payload),
        };
    }
   
    async loginUser(user: any) {
        const payload = { 
            sub: user.id, 
            email: user.email, 
            name: user.name, 
            role: user.role, 
            avatar: user.avatar,
            business: user.role === 'admin' ? user.businessToManege : user.business
        };
        return {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                avatar: user.avatar,
                business: user.role === 'admin' ? user.businessToManege : user.business
            },
            token: this.jwtService.sign(payload),
        };
    }

    async validateClient(email: string, password: string) {
        try {
            const client = await this.clientService.findOneOrFail(email);
            const isPasswordValid = compareSync(password, client.password);
            if (!isPasswordValid) {
                return null;
            }
            return client;
        } catch (error) {
            return null;
        }
    }

    async validateUser(email: string, password: string) {
        let user: User;
        try {
            user = await this.userService.findOneOrFail(email);
        } catch (error) {
            return null;
        }
        const isPasswordValid = compareSync(password, user.password);
        if (!isPasswordValid) {
            return null;
        }
        return user;
    }
}