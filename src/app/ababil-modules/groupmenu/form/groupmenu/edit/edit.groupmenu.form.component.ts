import {Component,OnInit,OnDestroy} from '@angular/core';
import {GroupmenuSaveEvent} from '../groupmenu.form.component';
import {Router,ActivatedRoute} from '@angular/router';
import {GroupMenuProfile} from '../../../../../services/groupmenu/domain/groupmenu.models';
import {GroupmenuService} from '../../../../../services/groupmenu/service-api/groupmenu.service';
import {Message} from 'primeng/primeng';
import {Subscriber,Observable} from 'rxjs';
import {GroupmenuFormData} from '../groupmenu.form.component';
import {NotificationService} from '../../../../../common/notification/notification.service';
import {map}from 'rxjs/operators';

@Component({
  selector: 'edit-groupmenu-profile-form',
  templateUrl: './edit.groupmenu.form.component.html',
})
export class EditGroupMenuFormComponent implements OnInit,OnDestroy{

private subscribers:any={};
  
constructor(private groupMenuService:GroupmenuService,private router: Router, private route: ActivatedRoute, private notificationService:NotificationService){}
   
  private msgs: Message[] = [];
  groupMenuFormData:Observable<GroupmenuFormData>;
  private selectedId:number;

  ngOnInit(){
      this.subscribers.routeSub = this.route.params.subscribe(params => {
           this.selectedId = +params['id'];   
       });

       this.fetchGroupmenuDetail()
  }

  ngOnDestroy(){
     for (let subscriberKey in this.subscribers) {
          let subscriber = this.subscribers[subscriberKey];
          if (subscriber instanceof Subscriber) {
            subscriber.unsubscribe();
          }
     }
  }

  fetchGroupmenuDetail(){
      this.groupMenuFormData = this.groupMenuService
      .fetchGroupmenuProfileDetail({"id":this.selectedId+""})
      .pipe(map(profileDetails=>{
         return {id:profileDetails.id,code:profileDetails.code,name:profileDetails.name}
      }));

      this.subscribers.formDatasub=this.groupMenuFormData.subscribe();
   }

  onSave(event: GroupmenuSaveEvent): void {
      this.updateGroupMenu({id:this.selectedId,code:event.groupmenuForm.code,name:event.groupmenuForm.name});
  }

  updateGroupMenu(groupmenu:GroupMenuProfile){
       this.subscribers.saveSub=this.groupMenuService.updateGroupmenu(groupmenu,{"id":this.selectedId+""}).subscribe(
         (data)=>{
            this.notificationService.sendSuccessMsg("groupmenu.update.success");
            //this.navigateAway();  
            
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