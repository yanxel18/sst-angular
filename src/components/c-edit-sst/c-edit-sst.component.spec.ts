import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CEditSstComponent } from './c-edit-sst.component';

describe('CEditSstComponent', () => {
  let component: CEditSstComponent;
  let fixture: ComponentFixture<CEditSstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CEditSstComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CEditSstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
