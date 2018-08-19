import {Component,OnInit,OnDestroy} from '@angular/core';
import {NotificationService,NotificationEvent,NotificationType} from '../common/notification/notification.service';
import {Subscription} from 'rxjs';
import {Message} from 'primeng/primeng';

@Component({
   selector:'app-notification',
   templateUrl:'./app.notification.component.html'
})
export class AppNotificationComponent implements OnInit{

   private notificationSubscription:Subscription;
   msgs: Message[] = [];
   
   constructor(private notificationService:NotificationService) {}

   ngOnInit(){
      this.notificationSubscription = this.notificationService.notifications$.subscribe(
          (notification)=>{
             this.showNotification(notification);  
          }
      )
   }

   ngOnDestroy(){
     this.notificationSubscription.unsubscribe();
   }

   showNotification(notification:NotificationEvent){
       
    this.msgs=[];//not optimal
      
    switch(notification.type){
          
        case NotificationType.ALERT:
            this.msgs.push({severity:'error', summary:notification.title, detail:notification.message});
            break;

        case NotificationType.INFO:
            this.msgs.push({severity:'info', summary:notification.title, detail:notification.message});
            break; 
        
        case NotificationType.SUCCESS:
            this.msgs.push({severity:'success', summary:notification.title, detail:notification.message});
            break; 
        
        default:
            break;
    }            
  }


}