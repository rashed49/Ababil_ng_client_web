import { Component,OnInit,Input,Output,EventEmitter,OnChanges,SimpleChanges,SimpleChange } from '@angular/core';
import { BaseComponent } from '../base.component';
import { ApprovalflowService } from '../../../services/approvalflow/service-api/approval.flow.service';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import * as searchParamConstants from '../../constants/app.search.parameter.constants';

export interface VerifierSelectionEvent{
   verifier:string;
   approvalFlowRequired:boolean;
}

@Component({
  selector: 'verifier-selection',
  templateUrl: './verifier.selection.component.html',
  styleUrls: ['./verifier.selection.component.scss']
})
export class VerifierSelectionComponent extends BaseComponent implements OnInit,OnChanges{

   @Input('visible') visible:boolean;
   @Input('command') command:string;
   @Input('processId') processId:string;

   verifierForm:FormGroup;
   verifiers:string[];

   showModal:boolean;

   @Output('onVerifierSelect') onVerifierSelect = new EventEmitter<VerifierSelectionEvent>();

   constructor(private workflowService: ApprovalflowService,private formBuilder: FormBuilder) {
     super();
   }

   ngOnInit(){
   this.prepareVerifierForm();
    
   }

   ngOnChanges(changes:SimpleChanges){    
     
     if(changes.visible){
      let visible: boolean = changes.visible.currentValue.value;
      if(visible) this.fetchVerificationInfo();
     }
   }

   onVerificationSelectionModalHide(){
     this.visible=false;
     this.prepareVerifierForm();//reset form
   }

   fetchVerificationInfo(){
     let urlSearchMap = new Map();
     if(this.processId) urlSearchMap.set(searchParamConstants.TASK_ID,this.processId);     
     urlSearchMap.set(searchParamConstants.COMMAND,this.command);
     this.workflowService.fetchVerificationInfo(urlSearchMap).subscribe(
        data=>{
           let verifierSelectionNotNeeded = !data.makerCheckerEnabled || data.approverType == 'ROLE' || data.lastTask;
           if(verifierSelectionNotNeeded){
             this.emitSelectionEvent(data.makerCheckerEnabled);
           }else{
             this.verifiers=data.verifyUsers;
             this.showModal=true;
           }
        }
     );
   }

   prepareVerifierForm(){
      this.verifierForm = this.formBuilder.group({
         verifier: [null, Validators.required]
      });
   }

   verifierFormInvalid(){
     return this.verifierForm.invalid;
   }

   emitSelectionEvent(selectionNeeded){
      let verifier = (selectionNeeded) ? this.verifierForm.get('verifier').value:null;
      this.onVerifierSelect.emit({
         verifier: verifier,
         approvalFlowRequired : selectionNeeded
      });
      this.showModal=false;       
   }

}