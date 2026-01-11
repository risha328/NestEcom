import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignupDto } from './dto/user-signup.dto';
import { UserEntity } from './entities/user.entity';
import { UserSigninDto } from './dto/user-signin.dto';
import { CurrentUser } from './utility/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() userSignUp:UserSignupDto):Promise<UserEntity>{
    console.log(userSignUp);
    return await this.usersService.signup(userSignUp);
    //return 'signup';
  }

  @Post('signin')
  async signin(@Body() userSigninDto: UserSigninDto) {
    return await this.usersService.signin(userSigninDto);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    //return this.usersService.create(createUserDto);
    return 'hi';
  }

  @Get('all')
  async findAll() : Promise<UserEntity[]> {
    return await this.usersService.findAll();
  }

  @Get('me')
  getProfile(@CurrentUser() currentUser: UserEntity) {
    if (!currentUser) {
      throw new UnauthorizedException('You must be authenticated to access this resource');
    }
    return currentUser;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) : Promise<UserEntity> {
    return await this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
