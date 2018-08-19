import { ReportViewerComponent } from './reports-viewer/reports.viewer.component';
import { ReportComponent } from './reports.component';
import { Routes } from '@angular/router';

export const ReportRoutes: Routes = [
  {path: '', component: ReportComponent},
  {path: 'view/:id', component: ReportViewerComponent}  
]