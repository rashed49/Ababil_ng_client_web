import {Component,OnInit,OnDestroy} from '@angular/core';
import {GroupmenuSaveEvent} from '../groupmenu.form.component';
import {Router,ActivatedRoute} from '@angular/router';
import {GroupMenuProfile} from '../../../../../services/groupmenu/domain/groupmenu.models';
import {GroupmenuService} from '../../../../../services/groupmenu/service-api/groupmenu.service';
import {Message} from 'primeng/primeng';
import {Subscriber} from 'rxjs';
import {NotificationService,NotificationType} from '../../../../../common/notification/notification.service';

@Component({
  selector: 'create-groupmenu-profile-form',
  templateUrl: './create.groupmenu.form.component.html',
})
export class CreateGroupMenuFormComponent implements OnInit,OnDestroy{

  private subscribers:any={};
  constructor(private groupMenuService:GroupmenuService,private router: Router, private route: ActivatedRoute, private notificationService:NotificationService){}
   
  msgs: Message[] = [];
  employeeFormData={id:null,code:'',name:''};

  ngOnInit(){

  }

  ngOnDestroy(){
     for (let subscriberKey in this.subscribers) {
          let subscriber = this.subscribers[subscriberKey];
          if (subscriber instanceof Subscriber) {
            subscriber.unsubscribe();
          }
       }
  }

  onSave(event: GroupmenuSaveEvent): void {
      this.saveGroupMenu({code:event.groupmenuForm.code,name:event.groupmenuForm.name});
  }

  saveGroupMenu(groupmenu:GroupMenuProfile){
       this.subscribers.saveSub=this.groupMenuService.createGroupmenu(groupmenu).subscribe(
         (data)=>{
            this.notificationService.sendSuccessMsg("groupmenu.save.success");
            this.navigateAway();
         }
       )
  }

  onCancel(): void{
     this.navigateAway();
  } 

  navigateAway(): void{
     this.router.navigate(['../'], { relativeTo: this.route });
  }

}