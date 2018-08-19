import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { map }from 'rxjs/operators';
import {GlAccount} from '../../services/glaccount/domain/gl.account.model';
import {GlAccountService} from '../../services/glaccount/service-api/gl.account.service';
import {Router} from '@angular/router';
import {BaseComponent} from '../../common/components/base.component';

@Component({
  selector: 'app-gl-account',
  templateUrl: './gl-account.component.html',
  styleUrls: ['./gl-account.component.scss']
})
export class GlAccountComponent extends BaseComponent implements OnInit {

  glAccounts:GlAccount[];
  @ViewChild('op') searchPanel:any;
  searchForm:FormGroup;

  constructor(private formBuilder:FormBuilder,private renderer:Renderer2,private router:Router,private glAccountService:GlAccountService){
    super();
    this.renderer.listen('window', 'scroll', (evt) => { 
          this.searchPanel.hide();                  
    });
  }

  ngOnInit() {
     //this.fetchGlAccounts(); 
     this.searchForm =  this.formBuilder.group({
      name: ['', [Validators.maxLength(32)]],
      code: ['', [Validators.maxLength(32)]]     
    });
  }

  fetchGlAccounts(){
    let urlSearchMap = new Map([[ 'roots',  'false' ],["aspage","false"]]);
    for (let control in this.searchForm.controls) {
      urlSearchMap.delete(control);
      let formControlValue:string = this.searchForm.get(control).value.trim();
      if (formControlValue.length !== 0)
        urlSearchMap.set(control, this.searchForm.get(control).value);
    }
    if(urlSearchMap.size<3) return;
    this.glAccountService.fetchGlAccounts(urlSearchMap)
    .pipe(map(glAccounts=>this.glAccounts=glAccounts)).subscribe();
  }

  onRowSelect(event){
    
  }

  cancel(){
     this.router.navigate(['glaccount']);
  }

}
