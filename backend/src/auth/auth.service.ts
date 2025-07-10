import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../database/entity/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async validateUser(email: string, password: string) : Promise<{isValid: boolean, user: User | null}> {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            return { isValid: false, user: null };
        }
        const isMatch = await compare(password, user.password);
        return { isValid: isMatch, user: isMatch ? user : null };
    }

    async login(isValide:boolean, user:User) : Promise<{ access_token: string } | null> {
        if (isValide) {
            const payload = { sub: user.id, username: user.email };

            return { access_token: this.jwtService.sign(payload) };
        }
        return null;
    }

    async checkIsLogin(user: User): Promise<{ isLoggedIn: boolean }> {
        return { isLoggedIn: !!user };
    }

}
