import {
	Injectable,
	ConflictException,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
		private config: ConfigService,
	) { }

	async register(dto: RegisterDto) {
		// Check if user already exists
		const existingUser = await this.prisma.user.findUnique({
			where: { email: dto.email },
		});

		if (existingUser) {
			throw new ConflictException('Email already registered');
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(dto.password, 10);

		// Create user
		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				password: hashedPassword,
				name: dto.name,
			},
		});

		// Generate tokens
		const tokens = await this.generateTokens(user.id, user.email);

		// Store refresh token
		await this.prisma.refreshToken.create({
			data: {
				token: tokens.refreshToken,
				userId: user.id,
				expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
			},
		});

		// Return user without password
		const { password, ...userWithoutPassword } = user;

		return {
			user: userWithoutPassword,
			...tokens,
		};
	}

	async login(dto: LoginDto) {
		try {
			// Find user by email
			const user = await this.prisma.user.findUnique({
				where: { email: dto.email },
			});

			// Generic error message to not reveal if email exists
			if (!user) {
				throw new UnauthorizedException('Invalid credentials');
			}

			// Verify password
			const passwordValid = await bcrypt.compare(dto.password, user.password);

			if (!passwordValid) {
				throw new UnauthorizedException('Invalid credentials');
			}

			// Generate tokens
			const tokens = await this.generateTokens(user.id, user.email);

			// Store refresh token
			await this.prisma.refreshToken.create({
				data: {
					token: tokens.refreshToken,
					userId: user.id,
					expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
				},
			});

			// Return user without password
			const { password, ...userWithoutPassword } = user;

			return {
				user: userWithoutPassword,
				...tokens,
			};
		} catch (err) {
			if (err instanceof UnauthorizedException) throw err;
			console.error('[AuthService.login]', err);
			throw err;
		}
	}

	async refreshTokens(refreshToken: string) {
		try {
			// Verify refresh token
			const payload = await this.jwtService.verifyAsync(refreshToken, {
				secret: this.config.get('JWT_REFRESH_SECRET'),
			});

			// Check if token exists and is not revoked
			const storedToken = await this.prisma.refreshToken.findUnique({
				where: { token: refreshToken },
			});

			if (!storedToken || storedToken.isRevoked) {
				throw new UnauthorizedException('Refresh token has been revoked');
			}

			// Check expiration
			if (storedToken.expiresAt < new Date()) {
				throw new UnauthorizedException('Refresh token has expired');
			}

			// Revoke old refresh token (rotation)
			await this.prisma.refreshToken.update({
				where: { id: storedToken.id },
				data: { isRevoked: true },
			});

			// Generate new token pair
			const tokens = await this.generateTokens(payload.sub, payload.email);

			// Store new refresh token
			await this.prisma.refreshToken.create({
				data: {
					token: tokens.refreshToken,
					userId: payload.sub,
					expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
				},
			});

			return tokens;
		} catch (error) {
			throw new UnauthorizedException('Invalid refresh token');
		}
	}

	private async generateTokens(userId: string, email: string) {
		const payload = { sub: userId, email };
		const accessSecret = this.config.get('JWT_ACCESS_SECRET');
		const refreshSecret = this.config.get('JWT_REFRESH_SECRET');
		if (!accessSecret || !refreshSecret) {
			throw new Error('JWT_ACCESS_SECRET va JWT_REFRESH_SECRET .env da belgilangan bo\'lishi kerak');
		}

		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(payload, {
				secret: accessSecret,
				expiresIn: '15m',
			}),
			this.jwtService.signAsync(payload, {
				secret: refreshSecret,
				expiresIn: '7d',
			}),
		]);

		return {
			accessToken,
			refreshToken,
		};
	}
}
