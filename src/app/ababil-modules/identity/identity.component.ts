import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from './../../common/components/base.component';
import { IdentityType } from '../../services/identity/domain/identity.type.models';
import { IdentityService } from './../../services/identity/service-api/identity.service';
import { NotificationService } from '../../common/notification/notification.service';


@Component({
  selector: 'app-identity',
  templateUrl: './identity.component.html',
  styleUrls: ['./identity.component.scss']
})
export class IdentityComponent extends BaseComponent implements OnInit {
  
  constructor(private identityService: IdentityService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService) {
    super();

  }

  subscription: any;
  identityTypes: IdentityType[];
  urlSearchParams: Map<string, string>;
  selected: IdentityType;

  ngOnInit() {
    this.fetchIdentityTypes();
  }

  fetchIdentityTypes() {
    this.urlSearchParams = new Map([['all', 'true']]);
    this.subscribers.fetchSub = this.identityService.fetchIdentityTypes(this.urlSearchParams).subscribe(
      types => {
        this.identityTypes = types.content;
      }
    );
  }

  create() {
    this.router.navigate(['edit',{id:null}], { relativeTo: this.route });
  }

  edit() {
    this.router.navigate(['edit', {id:this.selected.id}], { relativeTo: this.route });
  }

  delete(identityType: IdentityType) {
    this.subscribers.deleteSub = this.identityService.deleteIdentityType({ "id": this.selected.id + "" }).subscribe(
      (data) => {
        this.notificationService.sendSuccessMsg("identity.type.delete.success");
        this.fetchIdentityTypes();
      }
    );
  }

}
