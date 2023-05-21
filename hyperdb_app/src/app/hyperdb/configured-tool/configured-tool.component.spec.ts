import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguredToolComponent } from './configured-tool.component';

describe('ConfiguredToolComponent', () => {
  let component: ConfiguredToolComponent;
  let fixture: ComponentFixture<ConfiguredToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfiguredToolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfiguredToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
