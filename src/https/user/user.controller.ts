import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { Roles } from "src/auth/decorators/roles.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { User } from "src/entities/user.entity";
import { compressImage } from "src/helpers/CompressImage";
import { editFileName, imageFileFilter } from "src/helpers/EditNameFile";
import { Role } from "src/models/role.enum";
import { FindUserDTO } from "./dto/find-users.dto";
import { UserService } from "./user.service";

@Controller('users')
export class UserController {
    constructor(private readonly service: UserService) { }

    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('register')
    create(@Body() body: User) {
        return this.service.create(body);
    }

    @Post('register/client')
    createClient(@Body() body: User) {
        return this.service.create(body);
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor("file", {
        storage: diskStorage({
            destination: './storage/temp',
            filename: editFileName,
        }),
        fileFilter: imageFileFilter,
    }))
    @Post('upload-avatar')
    async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
        const avatar = await compressImage(file);
        return this.service.uploadAvatar(avatar, req.user);
    }


    @Get('list')
    findAll(@Query() query: FindUserDTO) {
        return this.service.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.service.findOne(id);
    }

    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() body: User) {
        return this.service.update(id, body);
    }
}