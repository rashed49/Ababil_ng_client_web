import { BaseComponent } from './../../../../common/components/base.component';
import { Component, ViewChild, OnInit } from '@angular/core';
import { IndividualInformation } from '../../../../services/cis/domain/individual.model';
import { CISService } from '../../../../services/cis/service-api/cis.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../common/notification/notification.service';

@Component({
    selector: 'edit-individual-form',
    templateUrl: './edit.individual.form.component.html'
})
export class EditIndividualFormComponent extends BaseComponent implements OnInit {

    @ViewChild('individualForm') individualComponent: any;
    individualInfoFormData: IndividualInformation;

    queryParams: any;
    individualId: number;

    constructor(private cisService: CISService,
        private route: ActivatedRoute,
        private router: Router,
        private notificationService: NotificationService) {
        super();
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.queryParams = params;
        });
    }

    saveIndividualInformation() {
        let individual = this.individualComponent.extractData();
        // console.log("this.individualInfoFormData.id: "+this.individualInfoFormData.id);
        // if(this.individualInfoFormData.id)
        // if (this.individualSubject) {
        //     individual.id = this.individualSubject.id;
        //     this.updateSubject(individual);
        // } else {
        //     this.saveSubject(individual);

        // }
        this.saveIndividual(individual);
    }

    saveIndividual(individual) {
        this.subscribers.saveSubjectSub = this.cisService.createIndividualInformation(individual)
            .subscribe(response => {
                this.individualId = response.content;
                this.notificationService.sendSuccessMsg("individual.save.success");
                this.navigateaway(this.individualId);
            });
    }

    cancel() {
        if (this.queryParams.nominee) {
            this.navigateaway();
        }
        else if (this.queryParams.signature) {
            this.router.navigate([this.queryParams.signature],{ queryParamsHandling: 'merge'
            });
        }
    }

    navigateaway(individualId: number = null) {
        let queryParams: any = {};
        if (individualId != null) {
            if(this.queryParams.type=="nominee"){
               queryParams.individualId = individualId; 
            }else{
               queryParams.guardianId = individualId; 
            }            
        }

        if (this.queryParams.nominee !== undefined) {
            this.router.navigate([this.queryParams.nominee], {
                queryParams: queryParams, queryParamsHandling: 'merge'
            });
        } else if (this.queryParams.signature !== undefined) {
            this.router.navigate([this.queryParams.signature], {
                queryParams: {individualId: individualId}, queryParamsHandling: 'merge'
            });
        }
    }

}