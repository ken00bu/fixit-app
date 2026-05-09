import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Repository, OneToMany, ManyToOne, DeleteDateColumn } from "typeorm";
import { Report } from "src/reports/entity/report.entity";
import { Priority } from "src/priority/entity/priority.entity";

@Entity('categories')
export class Category {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string

    @Column({
        default: true,
    })
    isSystem: boolean;

    @ManyToOne(()=>Priority, (priority)=>priority.category)
    priority: Priority
    
    @OneToMany(()=> Report, (report)=> report.category)
    report: Report[];

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn()
    deleteAt: Date
    
}