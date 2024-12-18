import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserProjectRole } from '../../user-project-role/entities/user-project-role.entity';

@Entity({ name: 'Roles' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    unique: true,
  })
  name: string;

  @OneToMany(() => UserProjectRole, (userProjectRole) => userProjectRole.role)
  userProjectRoles: UserProjectRole[];
}
