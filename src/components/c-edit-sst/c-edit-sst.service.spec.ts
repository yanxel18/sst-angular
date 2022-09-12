import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpErrorHandlerService } from 'src/error-handler/http-error-handler.service';
import { HttpErrorMessageboxService } from 'src/error-handler/http-error-messagebox.service';

import { CEditSstService } from './c-edit-sst.service';

describe('CEditSstService', () => {
  let service: CEditSstService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers:[
        HttpErrorHandlerService,
        HttpErrorMessageboxService
      ]
    });
    service = TestBed.inject(CEditSstService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
