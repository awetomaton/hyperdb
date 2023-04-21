import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cart3DSettingComponent } from './cart3d-setting.component';

describe('Cart3DSettingComponent', () => {
  let component: Cart3DSettingComponent;
  let fixture: ComponentFixture<Cart3DSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Cart3DSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cart3DSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
