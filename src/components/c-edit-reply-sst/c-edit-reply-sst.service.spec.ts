import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpErrorHandlerService } from 'src/error-handler/http-error-handler.service';
import { HttpErrorMessageboxService } from 'src/error-handler/http-error-messagebox.service';

import { CEditReplySstService } from './c-edit-reply-sst.service';

describe('CEditReplySstService', () => {
  let service: CEditReplySstService;

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
    service = TestBed.inject(CEditReplySstService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
