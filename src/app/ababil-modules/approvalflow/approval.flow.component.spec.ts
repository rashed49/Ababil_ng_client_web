import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalflowComponent } from './approval.flow.component';

describe('WorkflowComponent', () => {
  let component: ApprovalflowComponent;
  let fixture: ComponentFixture<ApprovalflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
