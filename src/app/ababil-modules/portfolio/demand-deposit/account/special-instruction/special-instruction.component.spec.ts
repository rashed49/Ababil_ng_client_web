import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialInstructionComponent } from './special-instruction.component';

describe('SpecialInstructionComponent', () => {
  let component: SpecialInstructionComponent;
  let fixture: ComponentFixture<SpecialInstructionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialInstructionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialInstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
