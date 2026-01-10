import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserSignupDto } from './dto/user-signup.dto';
import {hash} from 'bcrypt';
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
}
