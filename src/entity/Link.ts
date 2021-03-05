import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity()
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 2000, unique: true })
  original: string;

  @Column({ nullable: false, length: 5 })
  protocol: string;

  @Index({ unique: true })
  @Column({ nullable: false, length: 6, unique: true })
  shorted: string;

  @Column({ nullable: false, default: 0 })
  accessed: number;
}
