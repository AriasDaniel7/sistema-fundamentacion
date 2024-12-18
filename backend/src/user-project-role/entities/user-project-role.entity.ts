import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from '../../project/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
import { Role } from '../../role/entities/role.entity';

@Entity({ name: 'Proyectos_Usuarios_Roles' })
export class UserProjectRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user, { eager: true, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Project, (project) => project, {
    onDelete: 'CASCADE',
  })
  project: Project;

  @ManyToOne(() => Role, (role) => role, { eager: true})
  role: Role;
}
