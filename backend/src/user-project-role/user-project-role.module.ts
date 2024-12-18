import { Module } from '@nestjs/common';
import { UserProjectRoleService } from './user-project-role.service';
import { UserProjectRoleController } from './user-project-role.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProjectRole } from './entities/user-project-role.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    TypeOrmModule.forFeature([UserProjectRole]),
  ],
  controllers: [UserProjectRoleController],
  providers: [UserProjectRoleService],
  exports: [TypeOrmModule, UserProjectRoleService],
})
export class UserProjectRoleModule {}
