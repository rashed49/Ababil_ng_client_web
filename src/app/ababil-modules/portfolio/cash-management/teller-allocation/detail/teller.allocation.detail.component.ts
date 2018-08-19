import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../../../common/components/base.component';
import { map }from 'rxjs/operators';
import { TellerAllocationService } from '../../../../../services/teller/service-api/teller.allocation.service';
import { TellerAllocation } from '../../../../../services/teller/domain/teller.models';

@Component({
    templateUrl: './teller.allocation.detail.component.html'
})
export class TellerAllocationDetailComponent extends BaseComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private tellerAllocationService: TellerAllocationService,
    ) {
        super();
    }

    tellerAllocationDetails: TellerAllocation = new TellerAllocation();
    tellerAllocationId: number;
    tellerTitle: string;
    ngOnInit() {
        this.subscribers.routeSub = this.route.params.subscribe(params => {
            this.tellerAllocationId = +params['id'];
            this.fetchTellerAllocationDetails();        
        });
    }

    fetchTellerAllocationDetails() {
        this.subscribers.fetchSub = this.tellerAllocationService
            .fetchTellerAllocationDetail({ id: this.tellerAllocationId + '' })
            .pipe(map(tellerAllocation => this.tellerAllocationDetails = tellerAllocation))
            .subscribe();
    }


    cancel() {
        this.navigateAway();
    }

    navigateAway() {
        this.router.navigate(['../../'], { relativeTo: this.route });
    }


}