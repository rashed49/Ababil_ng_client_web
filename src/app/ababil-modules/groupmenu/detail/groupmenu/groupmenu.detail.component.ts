import {Component,OnInit,OnDestroy} from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import {GroupMenuProfile,GroupmenuTask} from '../../../../services/groupmenu/domain/groupmenu.models';
import {GroupmenuService} from '../../../../services/groupmenu/service-api/groupmenu.service';
import {Subscriber,Observable} from 'rxjs';
import { PathParameters } from '../../../../services/base.service';
import {NotificationService,NotificationType} from '../../../../common/notification/notification.service';

@Component({
    selector:'groupmenu-detail',
    templateUrl:'./groupmenu.detail.component.html'
})
export class GroupmenuDetailComponent implements OnInit,OnDestroy{

   private selectedId:number;
   private subscribers:any={};
   profile:GroupMenuProfile={code:null,name:null};
   private tasks:Observable<GroupmenuTask[]>;

   constructor(private route: ActivatedRoute, private router: Router, private groupmenuService:GroupmenuService,private notificationService:NotificationService) {} 

   ngOnInit():void{
       this.subscribers.routeSub = this.route.params.subscribe(params => {
           this.selectedId = +params['id'];
           console.log(this.selectedId);      
       });

       this.fetchGroupmenuDetail();
    //    this.fetchGroupmenuTasks();
   }

   fetchGroupmenuDetail(){
      this.subscribers.groupmenuDetailSub = this.groupmenuService.fetchGroupmenuProfileDetail(
          {"id":this.selectedId+""}
      ).subscribe(profileDetails=>{
        this.profile=profileDetails;
      });
   }

//    fetchGroupmenuTasks(){
//       let urlSearchParam = new Map([[ 'profile',  this.selectedId+"" ]]);
//       this.tasks = this.groupmenuService.fetchGroupmenuTasks(
//           urlSearchParam,{"profileId":this.selectedId+""}
//       ).map(tasks=>{
//         return tasks;
//       });
      
//       this.tasks.subscribe();
//    }

   ngOnDestroy():void{
       for (let subscriberKey in this.subscribers) {
          let subscriber = this.subscribers[subscriberKey];
          if (subscriber instanceof Subscriber) {
            subscriber.unsubscribe();
          }
       }
       
    }

    cancel(){
      this.navigateAway();
    }

    navigateAway(): void{
      this.router.navigate(['../../'], { relativeTo: this.route });
    }

    createTask(){
       this.router.navigate(['task/create'],{ relativeTo: this.route });
    }

    onTaskSelect(event) {
     this.router.navigate(['tasks',event.data.id],{ relativeTo: this.route });   
    }

   



}