import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserSignupDto } from './dto/user-signup.dto';
import { UserSigninDto } from './dto/user-signin.dto';
import {hash, compare} from 'bcrypt';
//import { sign } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import { Roles } from './utility/common/user-roles.enum';
@Injectable()
export class UsersService {
  constructor(
     @InjectRepository(UserEntity)
      private usersRepository:Repository<UserEntity>,
  ){}
   async signup(userSignUp:UserSignupDto):Promise<UserEntity>{
    const userExists = await this.findByEmail(userSignUp.email);
    if(userExists){
      throw new Error('User with this email already exists');
    }
    userSignUp.password=await hash(userSignUp.password,10);
    const user = this.usersRepository.create(userSignUp);
    return await this.usersRepository.save(user);
  }

  //   async signin(UserSigninDto:UserSigninDto){
  //     const userExists= await this.usersRepository.createQueryBuilder('users').addSelect('users.password').where('users.email=:email',{email:UserSigninDto.email}).getOne();
  //     if(!userExists){
  //       throw new Error('User with this email does not exist');
  //     }
  //     const matchPassword= await compare(UserSigninDto.password,userExists.password);
  //     if(!matchPassword){
  //       throw new Error('Invalid password');
  //     }
  //     const { password, ...userWithoutPassword } = userExists;
  //   return userWithoutPassword;
  // }

  async signin(userSigninDto: UserSigninDto) {
  const userExists = await this.usersRepository
    .createQueryBuilder('users')
    .addSelect('users.password')
    .where('users.email = :email', { email: userSigninDto.email })
    .getOne();

  if (!userExists) {
    throw new Error('User with this email does not exist');
  }

  const matchPassword = await compare(
    userSigninDto.password,
    userExists.password
  );

  if (!matchPassword) {
    throw new Error('Invalid password');
  }

  const token = await this.accessToken(userExists);

  const { password, ...userWithoutPassword } = userExists;

  return {
    user: userWithoutPassword,
    accessToken: token,
  };
}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(id: number) : Promise<UserEntity> {
    const user = await this.usersRepository.findOne({where: {id}});
    if(!user){
      throw new Error('User not found');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto, currentUser?: UserEntity): Promise<UserEntity> {
    const user = await this.findOne(id);
    
    // If password is being updated, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await hash(updateUserDto.password, 10);
    }
    
    // If email is being updated, check if it already exists
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailExists = await this.findByEmail(updateUserDto.email);
      if (emailExists) {
        throw new Error('User with this email already exists');
      }
    }
    
    // If roles are being updated, check permissions
    if (updateUserDto.roles !== undefined) {
      // Allow users to update their own role (self-update)
      // OR allow admins to update any user's role
      const isSelfUpdate = currentUser && currentUser.id === id;
      const isAdmin = currentUser && currentUser.roles === Roles.ADMIN;
      
      if (!isSelfUpdate && !isAdmin) {
        // Remove roles from update if user is not updating themselves and not an admin
        delete updateUserDto.roles;
      }
    }
    
    // Update the user
    Object.assign(user, updateUserDto);
    return await this.usersRepository.save(user);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findByEmail(email:string):Promise<UserEntity | null>{
    return await this.usersRepository.findOneBy({email});
  }

 async accessToken(user: UserEntity): Promise<string> {
  const secret = process.env.ACCESS_TOKEN_SECRET_KEY;
  if (!secret) {
    throw new Error('ACCESS_TOKEN_SECRET_KEY is not defined');
  }
  
  const options = {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME || '1h',
  } as SignOptions;
  
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    secret,
    options
  );
}

}