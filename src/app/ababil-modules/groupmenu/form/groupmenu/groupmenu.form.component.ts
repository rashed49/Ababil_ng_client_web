import {Component,OnInit,OnDestroy,Input,Output,EventEmitter} from '@angular/core';
import {FormGroup,FormBuilder,Validators} from '@angular/forms';

export interface GroupmenuFormData{
    id:number,
    code:string,
    name:string
}

export interface GroupmenuSaveEvent{
    groupmenuForm:{
      id:number,  
      code:string,
      name:string
    }    
}

@Component({
  selector: 'groupmenu-form',
  templateUrl: './groupmenu.form.component.html',
})
export class GroupMenuFormComponent implements OnInit,OnDestroy{

   groupmenuForm:FormGroup;
   groupMenu: GroupmenuFormData;

   @Input('formData') set formData(formData: GroupmenuFormData){
      this.prepareGroupmenuForm(formData);
   }

   @Input('editMode') editMode: boolean;
   @Output('onSave') onSave = new EventEmitter<GroupmenuSaveEvent>();
   @Output('onCancel') onCancel = new EventEmitter<void>(); 

   constructor(private formBuilder: FormBuilder) {}
   
   ngOnInit(){

   }

   ngOnDestroy(){

   }

   prepareGroupmenuForm(formData:GroupmenuFormData){
      formData=(formData==null?{id:null,name:null,code:null}:formData);
      this.groupMenu=formData; 
      this.groupmenuForm = this.formBuilder.group({
      code: [formData.code, [Validators.required, Validators.minLength(3), Validators.maxLength(32)]],
      name: [formData.name, [Validators.required, Validators.minLength(3), Validators.maxLength(32)]]  
    });
   }

   save(): void{
    let groupmenu =  this.groupmenuForm.value;
    groupmenu.id  =  this.groupMenu.id;
    this.onSave.emit({
      groupmenuForm: groupmenu      
    });
  }

  cancel(): void{
    this.onCancel.emit();
  }

  formsInvalid(): boolean{
    return (this.groupmenuForm.invalid);
  }

}