import { Component, OnInit } from '@angular/core';
import { GlAccountService } from '../../../services/glaccount/service-api/gl.account.service';
import { GlAccount } from '../../../services/glaccount/domain/gl.account.model';
import { ActivatedRoute, Router } from '@angular/router';
import { map }from 'rxjs/operators';
import { Location } from '@angular/common';
import { BaseComponent } from '../../../common/components/base.component';

@Component({
    templateUrl: './gl.account.detail.component.html'
})
export class GlAccountDetailComponent extends BaseComponent implements OnInit {

    constructor(private location: Location, private route: ActivatedRoute, private router: Router, private glAccountService: GlAccountService) {
        super();
    }

    glAccountDetails: GlAccount = new GlAccount();
    glAccountId: number;

    ngOnInit() {
        this.subscribers.routeSub = this.route.params.subscribe(params => {
            this.glAccountId = +params['id'];
            this.fetchGlAccountDetails();//should be done with flatmap         
        });
    }

    fetchGlAccountDetails() {
        this.subscribers.fetchSub = this.glAccountService.
            fetchGlAccountDetails({ id: this.glAccountId + "" })
            .pipe(map(glAccount => this.glAccountDetails = glAccount))
            .subscribe();
    }

    cancel() {
        this.navigateAway();
    }

    navigateAway() {
        this.router.navigate(['../../'], { relativeTo: this.route });
    }

}