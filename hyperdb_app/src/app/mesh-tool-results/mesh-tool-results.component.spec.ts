import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeshToolResultsComponent } from './mesh-tool-results.component';

describe('MeshToolResultsComponent', () => {
  let component: MeshToolResultsComponent;
  let fixture: ComponentFixture<MeshToolResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeshToolResultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeshToolResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
