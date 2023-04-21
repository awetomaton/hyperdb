import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCBAeroSettingComponent } from './new-cbaero-setting.component';

describe('NewCBAeroSettingComponent', () => {
  let component: NewCBAeroSettingComponent;
  let fixture: ComponentFixture<NewCBAeroSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCBAeroSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCBAeroSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
