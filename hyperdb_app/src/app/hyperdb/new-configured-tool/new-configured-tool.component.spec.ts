import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewConfiguredToolComponent } from './new-configured-tool.component';

describe('NewConfiguredToolComponent', () => {
  let component: NewConfiguredToolComponent;
  let fixture: ComponentFixture<NewConfiguredToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewConfiguredToolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewConfiguredToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
