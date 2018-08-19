import { Component, OnInit,OnDestroy } from '@angular/core';
import { GroupmenuService } from '../../services/groupmenu/service-api/groupmenu.service';
import { GroupMenuProfile } from '../../services/groupmenu/domain/groupmenu.models';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ababil-groupmenu',
  templateUrl: './groupmenu.component.html',
  styleUrls: ['./groupmenu.component.scss']
})
export class GroupmenuComponent implements OnInit,OnDestroy {

  constructor(private groupmenuService:GroupmenuService,private route: ActivatedRoute,private router:Router) { }
  
  subscription:any;

  groupMenuProfiles:GroupMenuProfile[];

  urlSearchParam : Map<string, string>; 

  ngOnInit() {
    this.fetchGroupmenuProfiles();
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  fetchGroupmenuProfiles(){
    this.urlSearchParam = new Map([[ 'all',  'true' ]]);
    this.subscription=this.groupmenuService.fetchGroupmenuProfiles(this.urlSearchParam).subscribe(
      profiles => {
          this.groupMenuProfiles=profiles.content;     
      }
    );
  }

  create(){
       this.router.navigate(['create'],{ relativeTo: this.route });  
  }

  onRowSelect(event) {
     this.router.navigate(['detail',event.data.id],{ relativeTo: this.route });   
  }

}
