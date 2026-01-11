import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignupDto } from './dto/user-signup.dto';
import { UserEntity } from './entities/user.entity';
import { UserSigninDto } from './dto/user-signin.dto';
import { CurrentUser } from './utility/decorators/current-user.decorator';
import { AuthenticationGuard } from './utility/guards/authentication.guard';
import { AuthorizationGuard } from './utility/guards/authorization.guard';
import { UpdateUserGuard } from './utility/guards/update-user.guard';
import { RolesDecorator } from './utility/decorators/roles.decorator';
import { Roles } from './utility/common/user-roles.enum';


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

  // Admin only - Get all users
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RolesDecorator(Roles.ADMIN)
  @Get('all')
  async findAll() : Promise<UserEntity[]> {
    return await this.usersService.findAll();
  }

  // Authenticated users only - Get current user profile
  @UseGuards(AuthenticationGuard)
  @Get('me')
  getProfile(@CurrentUser() currentUser: UserEntity) {
    return currentUser;
  }

  // Authenticated users only - Get user by ID
  @UseGuards(AuthenticationGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) : Promise<UserEntity> {
    return await this.usersService.findOne(+id);
  }

  // Users can update their own profile, or admins can update any user
  @UseGuards(AuthenticationGuard, UpdateUserGuard)
  @RolesDecorator(Roles.ADMIN)
  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: UserEntity
  ): Promise<UserEntity> {
    return await this.usersService.update(+id, updateUserDto, currentUser);
  }

  // Admin only - Delete user
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RolesDecorator(Roles.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
