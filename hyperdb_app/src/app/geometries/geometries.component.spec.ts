import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeometriesComponent } from './geometries.component';

describe('GeometriesComponent', () => {
  let component: GeometriesComponent;
  let fixture: ComponentFixture<GeometriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeometriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeometriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
