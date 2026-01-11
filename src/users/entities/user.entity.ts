import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from 'typeorm';
import { Roles } from '../utility/common/user-roles.enum';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column({ unique: true })
    email: string;
    @Column({ select: false })
    password: string;
    @Column({type: 'enum', enum: Roles, default: Roles.USER})
    roles: Roles;
    @CreateDateColumn()
    createdAt: Timestamp;
    @UpdateDateColumn({type: 'timestamptz'})
    updatedAt: Date;
}
    
