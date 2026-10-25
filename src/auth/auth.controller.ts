import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dtos/CreateUserDto';
import { BodyResponse } from '../lost-pets/dtos/body-response.dto';
import { LoginUserDto } from './dtos/LoginUserDto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ){}

    @Post("login")
    async login(@Body() dto: LoginUserDto){
        const response : BodyResponse = {
            status: 200,
            error: false,
            errorMessage: undefined,
            data: undefined
        }
        const id = await this.authService.login(dto.email, dto.password);
        response.data = {
            token: id
        };
        return response
    }

    @Post("register")
    async register(@Body() dto: CreateUserDto){
        const response : BodyResponse = {
            status: 200,
            error: false,
            errorMessage: undefined,
            data: undefined
        }
        const token = await this.authService.register(dto);
        response.data = {
            token: token
        };
        return response;
    }
}