import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query } from '@nestjs/common';
import { CreateProfileUserDto } from './dto/create-profile-user.dto';
import { UpdateProfileUserDto } from './dto/update-profile-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { PaginationDto } from 'src/common';

@Controller('users')
export class ProfileUsersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {
  }

  @Post()
  create(@Body() createUserDto: CreateProfileUserDto) {
    return this.client.send("createUser", createUserDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.client.send("findAllUsers", paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.client.send("findUserById",+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateProfileUserDto,
  ) {
    return this.client.send("updateUser", {id, updateUserDto});
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.client.send("deleteUser",+id);
  }
}
