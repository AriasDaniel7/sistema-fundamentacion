import { UserProjectRole } from '../../user-project-role/entities/user-project-role.entity';

import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'Usuarios' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  userName: string;

  @Column({
    type: 'varchar',
    length: 80,
    nullable: false,
    select: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  fullName: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
  })
  phone: number;

  @OneToMany(() => UserProjectRole, (userProjectRole) => userProjectRole.user, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  userProjectRoles: UserProjectRole[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase();
    this.userName = this.userName.toLowerCase().trim().replace(' ', '_');
    this.fullName = this.fullName.trim();
    this.password = this.password.trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeUpdate();
  }
}
