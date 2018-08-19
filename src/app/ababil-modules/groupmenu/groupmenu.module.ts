import { NgModule } from '@angular/core';
import { AbabilNgSharedModule } from '../../common/ababil-ng-shared-module.module';
import { GroupmenuComponent } from './groupmenu.component';
import { GroupmenuService } from '../../services/groupmenu/service-api/groupmenu.service';
import { RouterModule } from '@angular/router';
import { GroupMenuRoutes } from './groupmenu.routes';
import { GroupmenuDetailComponent } from './detail/groupmenu/groupmenu.detail.component';
import { CreateGroupMenuFormComponent } from './form/groupmenu/create/create.groupmenu.form.component';
// import { CreateGroupMenuTaskFormComponent } from './form/task/create/create.groupmenutask.form.component';
import { EditGroupMenuFormComponent } from './form/groupmenu/edit/edit.groupmenu.form.component';
// import { EditGroupMenuTaskFormComponent } from './form/task/edit/edit.groupmenutask.form.component';
import { GroupMenuFormComponent } from './form/groupmenu/groupmenu.form.component';
// import { GroupMenuTaskFormComponent } from './form/task/groupmenutask.form.component';
import { ReactiveFormsModule } from '@angular/forms';
// import { GroupmenuTaskDetailComponent } from './detail/task/groupmenu.task.detail.component';
import { TranslateService } from '@ngx-translate/core';
import {NotificationService} from '../../common/notification/notification.service';

@NgModule({
  imports: [
    AbabilNgSharedModule,
    RouterModule.forChild(GroupMenuRoutes),
    ReactiveFormsModule,
  ],
  declarations: [
    GroupmenuComponent,
    GroupMenuFormComponent,
    GroupmenuDetailComponent,
    CreateGroupMenuFormComponent,
    // CreateGroupMenuTaskFormComponent,
    EditGroupMenuFormComponent,
    // EditGroupMenuTaskFormComponent,
    // GroupMenuTaskFormComponent,
    // GroupmenuTaskDetailComponent
  ],
  providers:[
    GroupmenuService,
    TranslateService,        
  ]
})
export class GroupmenuModule { 
}
