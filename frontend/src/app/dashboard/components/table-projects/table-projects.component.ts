import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ProjectResponse } from '../../interfaces/project-response.interface';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ProjectService } from '../../services/project.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'dashboard-table-projects',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule,
    RouterModule,
  ],
  templateUrl: './table-projects.component.html',
  styleUrl: './table-projects.component.scss',
})
export class TableProjectsComponent {
  private projectService = inject(ProjectService);
  @Input() projects!: ProjectResponse[];

  displayedColumns: string[] = [
    'Nombre',
    'Descripcion',
    'Rol de Proyecto',
    'Acciones',
  ];

  constructor(
    private readonly dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  onDelete(project: ProjectResponse) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        message: '¿Estás seguro de que quieres eliminar este proyecto?',
        title: 'Eliminar proyecto',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.projectService.deleteProject(project.project.id).subscribe(() => {
          this.projects = this.projects.filter(
            (p) => p.project.id !== project.project.id
          );
          this.snackBar.open('Proyecto eliminado', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-success'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        });
      }
    });
  }
}
