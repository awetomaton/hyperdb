import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAeroRunComponent } from './new-aero-run.component';

describe('NewAeroRunComponent', () => {
  let component: NewAeroRunComponent;
  let fixture: ComponentFixture<NewAeroRunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAeroRunComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewAeroRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
