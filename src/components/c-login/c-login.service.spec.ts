import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { CLoginService } from './c-login.service';
import { HttpErrorHandlerService } from 'src/error-handler/http-error-handler.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpErrorMessageboxService } from 'src/error-handler/http-error-messagebox.service';
describe('CLoginService', () => {
  let service: CLoginService;

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
    service = TestBed.inject(CLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
