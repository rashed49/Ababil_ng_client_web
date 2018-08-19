import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../common/components/base.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Message, SelectItem,LazyLoadEvent } from 'primeng/primeng';

@Component({
  selector: 'ababil-teller',
  templateUrl: './teller.component.html' 
})
export class TellerComponent extends BaseComponent implements OnInit {
  
    constructor(){
       super();
    }

    ngOnInit(){

    }

}