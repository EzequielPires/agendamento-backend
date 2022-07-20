import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(private readonly service: AuthService) {}

    @UseGuards(AuthGuard('localStrategy'))
    @Post('login')
    login(@Req() req) {
        return this.service.loginUser(req.user);
    }
}