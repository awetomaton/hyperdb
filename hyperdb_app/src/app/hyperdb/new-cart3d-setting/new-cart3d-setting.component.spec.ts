import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCart3DSettingComponent } from './new-cart3d-setting.component';

describe('NewCart3DSettingComponent', () => {
  let component: NewCart3DSettingComponent;
  let fixture: ComponentFixture<NewCart3DSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCart3DSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCart3DSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
