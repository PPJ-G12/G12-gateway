import { Body, Controller, Inject, Post } from "@nestjs/common";
import { RegisterUserDto } from "./dto/register-user.dto/register-user.dto";
import { LoginUserDto } from "./dto/login-user.dto/login-user.dto";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { NATS_SERVICE } from "src/config";
import { catchError } from "rxjs";

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy, 
  ) {}

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.client.send('registerUser', registerUserDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.client.send('loginUser', loginUserDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
