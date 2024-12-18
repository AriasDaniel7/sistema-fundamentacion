import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserProjectRoleModule } from 'src/user-project-role/user-project-role.module';

@Module({
  imports: [
    ConfigModule,
    UserProjectRoleModule,
    AuthModule,
    TypeOrmModule.forFeature([Project]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
