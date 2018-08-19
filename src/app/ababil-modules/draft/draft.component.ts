import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DraftService } from '../../services/draft/service-api/draft.service';
import { Draft } from '../../services/draft/domain/draft.model';
import { BaseComponent } from '../../common/components/base.component';
import { LazyLoadEvent } from 'primeng/primeng';

@Component({
    selector: 'ababil-drafts',
    templateUrl: './draft.component.html'
})
export class DraftsComponent extends BaseComponent implements OnInit {

    constructor(private draftService: DraftService,
        private route: ActivatedRoute,
        private router: Router) {
        super();
    }
    subscription: any;
    drafts: Draft[];
    totalRecords:number;
    totalPages:number;
    selectedDraft:Draft;

    ngOnInit() {
        this.fetchDrafts(new Map());
    }

    fetchDrafts(urlParam:Map<string,any>) {
        this.subscribers.fetchSub = this.draftService.fetchDrafts(urlParam).subscribe(
            data => {
                this.drafts = data.content;
                this.totalRecords=(data.pageSize*data.pageCount);
                this.totalPages=data.pageCount;
            }
        );
    }

    refresh(){
        this.fetchDrafts(new Map());
    }

    loadDraftsLazy(event:LazyLoadEvent){
       let searchMap=new Map();
       searchMap.set("page",(event.first/20));
       this.fetchDrafts(searchMap);
    }

    openDraft() {
        let routeParams = {
            title: null,
            id: null,
            draftId: this.selectedDraft.id
        }
        this.router.navigate([this.selectedDraft.uiUri, routeParams]);
    }

    deleteDraft(){
        this.draftService.deleteDraft({id:this.selectedDraft.id+""}).subscribe(
            data=>{
                this.fetchDrafts(new Map()); 
            }
        );
    }
}
