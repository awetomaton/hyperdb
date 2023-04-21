import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CBAeroSettingComponent } from './cbaero-setting.component';

describe('CBAeroSettingComponent', () => {
  let component: CBAeroSettingComponent;
  let fixture: ComponentFixture<CBAeroSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CBAeroSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CBAeroSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
