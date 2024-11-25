import { Controller, Post, Body, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto/login-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy, // Cliente para comunicarse con la API Auth
  ) {}

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    /* try { */
      return this.client.send('registerUser', registerUserDto);
   /*  } catch (error) {
      this.handleError(error);
    } */
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      return await this.client.send('loginUser', loginUserDto).toPromise();
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any): never {
    if (error?.response?.status) {
      throw new HttpException(
        error.response.message || 'Unexpected error',
        error.response.status,
      );
    } else if (error.code === 'ECONNREFUSED') {
      throw new HttpException(
        'Service unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    } else if (error.message?.includes('timeout')) {
      throw new HttpException(
        'Request timed out',
        HttpStatus.GATEWAY_TIMEOUT,
      );
    } else {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
