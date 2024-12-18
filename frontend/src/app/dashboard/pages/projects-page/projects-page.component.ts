import { Component, inject, OnInit } from '@angular/core';
import { ProjectResponse } from '../../interfaces/project-response.interface';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../../auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { TableProjectsComponent } from '../../components/table-projects/table-projects.component';

@Component({
  selector: 'dashboard-projects-page',
  standalone: true,
  imports: [TableProjectsComponent],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss',
})
export class ProjectsPageComponent implements OnInit {
  private projectService = inject(ProjectService);
  private authService = inject(AuthService);

  public projects: ProjectResponse[] = [];
  public currenId?: string;
  public loading = false;

  constructor() {
    this.currenId = this.authService.currentId();
  }

  ngOnInit(): void {
    this.projectService
      .getProjectsByUserId(this.currenId!)
      .subscribe((projects) => {
        this.projects = projects;
        this.loading = true;
      });
  }
}
