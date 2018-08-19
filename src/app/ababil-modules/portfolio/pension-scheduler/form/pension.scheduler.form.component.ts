import { Location } from '@angular/common';
import { NotificationService } from '../../../../common/notification/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { OnInit } from "@angular/core";
import { ApprovalflowService } from './../../../../services/approvalflow/service-api/approval.flow.service';
import { FormBaseComponent } from './../../../../common/components/base.form.component';

import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';

import { PensionScheduler } from '../../../../services/pension-scheduler/domain/pension.scheduler.model';
import { PensionSchedulerService } from '../../../../services/pension-scheduler/service-api/pension.scheduler.service';

export let initialPensionSchedulerFormData: PensionScheduler = new PensionScheduler();


@Component({
    selector: 'pension-scheduler-form',
    templateUrl: './pension.scheduler.form.component.html'
})

export class PensionSchedulerFormComponent extends FormBaseComponent implements OnInit {

    pensionSchedule: PensionScheduler = new PensionScheduler();
    pensionScheduleEmpty: boolean = true;
    accountUrl: string;
    customerUrl: string;
    
    principal: number;
    rate: number;
    tenor: number;

    totalRecords: number;
    totalPages: number;

    routeBack: string;
    accountId: number;
    
    type: string;
    principalRequired: boolean;
    tenorRequired: boolean;
    rateRequired: boolean;

    queryParams: any;

    
  urlSearchMap: Map<string, any> = new Map();


    constructor(private route: ActivatedRoute,
        private router: Router,
        private pensionSchedulerservice: PensionSchedulerService,
        private notificationService: NotificationService,
        private formBuilder: FormBuilder,
        protected location: Location,
        protected approvalflowService: ApprovalflowService, ) {
        super(location, approvalflowService);
    }

    ngOnInit(): void {

        this.subscribers.routeParamSub = this.route.params.subscribe(
            params => {
                this.subscribers.queryParamSub = this.route.queryParams.subscribe(
                    queryParams => {
                        this.queryParams = queryParams;
                        this.routeBack = queryParams['account'] ? queryParams['account'] : null;
                        this.commandReference = queryParams['commandReference'];
                        this.accountId = queryParams['accountId'];
                        this.taskId = this.queryParams['taskId'];
            
                    });
            });

    }


    submit() {
        if(!this.principal){
            this.principalRequired = true;
        }
        else {this.principalRequired = false;}

        if(!this.tenor){
            this.tenorRequired = true;
        }
        else {this.tenorRequired = false;}

        if(!this.rate){
            this.rateRequired = true;
        }
        else {this.rateRequired = false;}
        
        if(!this.principalRequired && !this.tenorRequired && !this.rateRequired)
        {
            this.fetchPensionSchedule(this.urlSearchMap);
        }


    }

    formInvalid() {
        // return this.pensionSchedulerForm.invalid;
    }

    navigateAway() {
        this.router.navigate([this.queryParams['account']], {
            queryParams: { cus: this.queryParams['cus'] }
        });
    }

    cancel() {
        this.navigateAway();
    }


    fetchPensionSchedule(urlSearchMap: Map<string, any>) {
        urlSearchMap.set('principal', this.principal + "")
        
        urlSearchMap.set('tenor', this.tenor + "")
        
        urlSearchMap.set('rate', this.rate + "")

        this.subscribers.fetchSubs = this.pensionSchedulerservice.fetchPensionScheduler(urlSearchMap).subscribe(
            pensionScheduler => {
                
                
            console.log(pensionScheduler);
            this.pensionSchedule = pensionScheduler;
            
            this.totalRecords = (pensionScheduler.pageSize * pensionScheduler.pageCount);
            this.totalPages = pensionScheduler.pageCount;
            this.pensionScheduleEmpty= false;
          }
    
        );
      }

}