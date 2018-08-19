import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Subscriber } from 'rxjs';
import { PathParameters } from '../../../../../../services/base.service';
import { NotificationService, NotificationType } from '../../../../../../common/notification/notification.service';
import { BaseComponent } from '../../../../../../common/components/base.component';
import { SpecialInstruction, SpecialInstructionType } from '../../../../../../services/special-instruction/domain/special.instruction.models';
import { SpecialInstructionService } from '../../../../../../services/special-instruction/service-api/special.instruction.service';

@Component({
    selector: 'app-specialInstruction-detail',
    templateUrl: './special.instruction.detail.component.html',
    styleUrls: ['./special.instruction.detail.component.scss']
})
export class SpecialInstructionDetailComponent extends BaseComponent implements OnInit{

   private accountId: number;
   private instructionId : number;
   instruction: any;

   constructor( private route: ActivatedRoute,
                private router: Router,
                private specialInstructionService: SpecialInstructionService,
                private notificationService: NotificationService) {
        super();
   }

    ngOnInit(): void {
       this.subscribers.routeSub = this.route.params.subscribe(params => {
           this.accountId = +params['id'];
           this.instructionId = +params['instructionId']
           console.log(this.accountId, this.instructionId);
           this.fetchSpecialInstructionDetail();

       });
    }

    fetchSpecialInstructionDetail() {
      this.subscribers.specialInstructionSub = this.specialInstructionService.fetchSpecialInstructionDetail(
          {'id': this.accountId + '','instructionId': this.instructionId + ''}).subscribe(
              instructionDetails => {
                this.instruction = instructionDetails ;
      });
    }

    // withdrawSpecialInstruction(){          
    //     this.subscribers.submitSub=this.specialInstructionService.
    //        withdrawSpecialInstruction({action:'WITHDRAW'},{id:"10",instructionId:this.instruction.id+""})
    //        .subscribe(data=>{           
    //            this.notificationService.sendSuccessMsg("Special Instruction Withdrawn");
               
    //     });
    
    //     console.log(this.instruction.id);
    //  }

    cancel() {
      this.navigateAway();
    }

    navigateAway(): void {
      this.router.navigate(['../../'], { 
        relativeTo: this.route, 
        queryParamsHandling:"merge" 
      });
    }
}
