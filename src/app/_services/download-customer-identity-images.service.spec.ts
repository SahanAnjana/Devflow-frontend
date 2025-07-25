import { TestBed } from '@angular/core/testing';

import { DownloadCustomerIdentityImagesService } from './download-customer-identity-images.service';

describe('DownloadCustomerIdentityImagesService', () => {
  let service: DownloadCustomerIdentityImagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadCustomerIdentityImagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
