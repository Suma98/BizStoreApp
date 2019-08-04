import { TestBed } from '@angular/core/testing';

import { SubproductsService } from './subproducts.service';

describe('SubproductsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubproductsService = TestBed.get(SubproductsService);
    expect(service).toBeTruthy();
  });
});
