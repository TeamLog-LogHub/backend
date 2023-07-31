import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  googleId!: string;

  @Column()
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  grade!: number;

  @Column()
  class!: number;

  @Column()
  number!: number;
}
