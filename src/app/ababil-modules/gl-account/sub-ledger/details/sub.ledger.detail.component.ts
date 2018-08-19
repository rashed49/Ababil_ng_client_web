import { Component, OnInit, ViewChild } from '@angular/core';
import { GlAccountService } from '../../../../services/glaccount/service-api/gl.account.service';
import { SubLedger } from '../../../../services/glaccount/domain/sub.ledger.model';
import { ActivatedRoute, Router } from '@angular/router';
import { map }from 'rxjs/operators';
import { Location } from '@angular/common';
import { FormBaseComponent } from '../../../../common/components/base.form.component';
import { ApprovalflowService } from '../../../../services/approvalflow/service-api/approval.flow.service';


@Component({
    templateUrl: './sub.ledger.detail.component.html'
})
export class SubLedgerDetailComponent extends FormBaseComponent implements OnInit{

    constructor(private route: ActivatedRoute, private router: Router, private glAccountService: GlAccountService, protected location: Location,
        protected approvalflowService: ApprovalflowService) {
        super(location, approvalflowService)
    }
    
    subLedgerDetails: SubLedger = new SubLedger();
    subLedgerId: number;
    display = false;
    
    queryParams: any;
    
    generalLedgerAccountId: number;

    @ViewChild('form') form: any;

    ngOnInit() {
        this.subscribers.routeSub = this.route.params.subscribe(params => {
            this.subLedgerId = +params['id'];
            this.fetchSubLedgerDetails(); 
});

this.route.queryParams.subscribe(params => {
    this.queryParams = params;
    this.taskId = params['taskId'];

    if (this.taskId) {
        this.taskId = params['taskId'];
        this.display = true;
      }
    this.commandReference = params['commandReference'];
  });     
    }

    fetchSubLedgerDetails() {
        this.subscribers.fetchSub = this.glAccountService.
            fetchSubGlDetails({ subsidiaryLedgerId: this.subLedgerId + "" })
            .pipe(map(data => {
                this.subLedgerDetails = data;
                this.generalLedgerAccountId = data.generalLedgerAccountId;
            })).subscribe();
    }

    editSubLedger() {
        this.display = true;
      }

      dialogcancel() {
        this.form.subLedgerForm.reset();
        this.display = false;
      }

      save() {
        this.form.submit();
        if (this.form.formInvalid()) {
          this.display = true;
        } 
        
        this.display = false;
      }

    cancel() {
        this.navigateAway();
    }

    navigateAway() {
        this.router.navigate(['../../'], { relativeTo: this.route,
        
            queryParams: {
                generalLedgerAccountId: this.generalLedgerAccountId
            },
            queryParamsHandling: 'merge'
        });
    }

}