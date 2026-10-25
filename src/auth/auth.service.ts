import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dtos/CreateUserDto';
import { TokenService } from './token/token.service';
// GUARDS

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private tokenService: TokenService
    ){}

    async login(email:string, password: string){
        const id = await this.userService.validate(email,password);
        if(!id) throw new BadRequestException("El email o la contraseña no es válido");
        const token = await this.tokenService.generate(id);
        return token;
    }

    async register(dto: CreateUserDto){
        const id = await this.userService.create(dto);
        const token = await this.tokenService.generate(id);
        return token;
    }
}
