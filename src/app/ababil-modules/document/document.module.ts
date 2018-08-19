import { DocumentComponent } from './document.component';
import { DocumentService } from './../../services/document/service-api/document.service';
import { DocumentRoutes } from './document.routing';
import { NgModule } from '@angular/core';
import { AbabilNgSharedModule } from '../../common/ababil-ng-shared-module.module';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


@NgModule({
  imports: [
    AbabilNgSharedModule,
    RouterModule.forChild(DocumentRoutes)    
  ],
  declarations: [
     DocumentComponent
  ],
  providers: [
    DocumentService
  ],
  exports:[

  ]
 })
export class DocumentModule {

}
