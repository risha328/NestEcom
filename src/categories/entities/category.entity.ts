import { UserEntity } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('categories')
export class CategoryEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    
    @Column()
    description: string;
    // @Column()
    // image: string;
    @Column()
    createdAt: Date;
    @Column()
    updatedAt: Date;

    @ManyToOne(()=>UserEntity, (user)=>user.categories)
    addedBy: UserEntity;

}
