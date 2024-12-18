import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserProjectRole } from '../../user-project-role/entities/user-project-role.entity';

@Entity({ name: 'Proyectos' })
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  description: string;

  @OneToMany(
    () => UserProjectRole,
    (userProjectRole) => userProjectRole.project,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  userProjectRoles: UserProjectRole[];
}
