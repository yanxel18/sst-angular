import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import { HttpErrorHandlerService } from 'src/error-handler/http-error-handler.service';
import { HttpErrorMessageboxService } from 'src/error-handler/http-error-messagebox.service';
import { CEditReplySstComponent } from './c-edit-reply-sst.component';

describe('CEditReplySstComponent', () => {
  let component: CEditReplySstComponent;
  let fixture: ComponentFixture<CEditReplySstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CEditReplySstComponent ],
      imports:[
        HttpClientTestingModule,
        RouterTestingModule,
        StoreModule.forRoot({})
      ],
      providers:[
        HttpErrorHandlerService,
        HttpErrorMessageboxService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CEditReplySstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
