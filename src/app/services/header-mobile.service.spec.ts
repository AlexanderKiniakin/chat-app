import { TestBed } from '@angular/core/testing';

import { HeaderMobileService } from './header-mobile.service';

describe('HeaderMobileService', () => {
  let service: HeaderMobileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeaderMobileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
