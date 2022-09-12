import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CCreateSstManualComponent } from './c-create-sst-manual.component';

describe('CCreateSstManualComponent', () => {
  let component: CCreateSstManualComponent;
  let fixture: ComponentFixture<CCreateSstManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CCreateSstManualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CCreateSstManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
