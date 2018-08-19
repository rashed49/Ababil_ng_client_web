import { ReportConfiguartionService } from './../../services/report-configuration/service-api/report.configuration.service';
import { ReportViewerComponent } from './reports-viewer/reports.viewer.component';
import { ReportComponent } from './reports.component';
import { ReportRoutes } from './reports.routes';
import { RouterModule } from '@angular/router';
import { AbabilNgSharedModule } from './../../common/ababil-ng-shared-module.module';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [
        AbabilNgSharedModule,
        RouterModule.forChild(ReportRoutes),
    ],
    declarations: [
        ReportComponent,
        ReportViewerComponent        
    ],
    providers: [
        ReportConfiguartionService
    ]
})
export class ReportsModule {
}
