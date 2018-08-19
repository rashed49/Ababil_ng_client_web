import { TestBed, inject } from '@angular/core/testing';

import { SpecialInstructionService } from './special.instruction.service';

describe('SpecialInstructionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpecialInstructionService]
    });
  });

  it('should be created', inject([SpecialInstructionService], (service: SpecialInstructionService) => {
    expect(service).toBeTruthy();
  }));
});
