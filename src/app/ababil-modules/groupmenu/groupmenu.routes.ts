import {Routes} from '@angular/router';
import {GroupmenuComponent} from './groupmenu.component';
import {GroupmenuDetailComponent} from './detail/groupmenu/groupmenu.detail.component';
import {CreateGroupMenuFormComponent} from './form/groupmenu/create/create.groupmenu.form.component';
import {EditGroupMenuFormComponent} from './form/groupmenu/edit/edit.groupmenu.form.component';
// import {CreateGroupMenuTaskFormComponent} from './form/task/create/create.groupmenutask.form.component';
// import {GroupMenuTaskDetailComponent} from './detail/task/groupmenu.task.detail.component';
// import {EditGroupMenuTaskFormComponent} from './form/task/edit/edit.groupmenutask.form.component';
// import {CommentsComponent} from '../comments/comments.component';

export const GroupMenuRoutes:Routes = [
  {path: '', component: GroupmenuComponent},
  {path: 'detail/:id', component: GroupmenuDetailComponent, pathMatch: 'full' },
  {path: 'create', component: CreateGroupMenuFormComponent },
  {path: 'detail/:id/edit', component: EditGroupMenuFormComponent, pathMatch: 'full' },
  // {path: 'comments', component: CommentsComponent }
  // {path: 'detail/:id/tasks/:taskid', component: GroupMenuTaskDetailComponent },
  // {path: 'detail/:id/task/create', component: CreateGroupMenuTaskFormComponent },
  // {path: 'detail/:id/tasks/:taskid/edit', component: EditGroupMenuTaskFormComponent },     
]