import { TestBed, inject } from '@angular/core/testing';

import { SpecialInstructionTypeService } from './special-instruction-type.service';

describe('SpecialInstructionTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpecialInstructionTypeService]
    });
  });

  it('should be created', inject([SpecialInstructionTypeService], (service: SpecialInstructionTypeService) => {
    expect(service).toBeTruthy();
  }));
});
