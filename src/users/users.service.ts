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

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
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