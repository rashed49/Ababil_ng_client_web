import { ReportConfiguartionService } from './../../services/report-configuration/service-api/report.configuration.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import {BaseComponent} from '../../common/components/base.component';

import * as reportConfigurations from './reports.json';

@Component({
  selector: 'report-component',
  templateUrl: './reports.component.html'
})
export class ReportComponent extends BaseComponent implements OnInit {

  reports:any[]=[];//for now any is good 

  constructor(private formBuilder:FormBuilder,
              private renderer:Renderer2,
              private route: ActivatedRoute,
              private router:Router,
              private repotConfigurationService:ReportConfiguartionService){
   super();
  }

  ngOnInit() {
    //this.reports =  <any>reportConfigurations;
    //console.log(this.reports);
    this.fetchReportConfigurations();
  }

  onRowSelect(event){
    console.log(event.data);
    this.router.navigate(['view',event.data.id],{relativeTo:this.route});
  }

  fetchReportConfigurations(){
    this.repotConfigurationService.fetchReportConfigurations()
      .subscribe(data=>{
         this.reports = data;  
      });
  }

}
