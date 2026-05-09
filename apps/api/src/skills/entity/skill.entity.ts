import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Repository, OneToMany, ManyToOne, OneToOne } from "typeorm";
import { User } from "src/users/entity/user.entity";

@Entity('skills')
export class Skill {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string

    @Column({
        default: true,
    })
    isSystem: boolean;

    @OneToMany(()=>User, (user)=>user.skill)
    user: User
    
    @CreateDateColumn()
    createdAt: Date;
    
}