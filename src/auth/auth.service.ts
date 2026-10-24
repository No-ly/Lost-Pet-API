import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // CORRECCIÓN: Cambiamos '...registerDto' por '...rest'
    const { email, password, lat, lon, ...rest } = registerDto;
    
    const existingUser = await this.userRepository.findOneBy({ email }); 
    if (existingUser) { 
        throw new BadRequestException('El correo ya está registrado'); 
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
        ...rest, // Ahora esta variable sí existe y contiene name, lastName, radius, etc.
        email, 
        password: hashedPassword, 
        location: lat !== undefined && lon !== undefined 
            ? ({ type: 'Point', coordinates: [lon, lat] } as any) 
            : undefined, 
    });

    const savedUser = await this.userRepository.save(user);

    const { password: _, ...userWithoutPassword } = savedUser; 
    
    return { 
        ok: true, 
        user: userWithoutPassword, 
        token: this.jwtService.sign({ id: savedUser.id, email: savedUser.email }), 
    }; 
  }

    async login(loginDto: LoginDto) { const { email, password } = loginDto;

    const user = await this.userRepository.findOneBy({ email }); 
    if (!user) { 
        throw new UnauthorizedException('Credenciales inválidas'); 
    }

    const isPasswordValid = await bcrypt.compare(password, user.password); 
    if (!isPasswordValid) { 
        throw new UnauthorizedException('Credenciales inválidas'); 
    }

    const { password: _, ...userWithoutPassword } = user; 
    
    return { 
        ok: true,
        user: userWithoutPassword, 
        token: this.jwtService.sign({ id: user.id, email: user.email }), 
    }; 
} 
}