import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeshesComponent } from './meshes.component';

describe('MeshesComponent', () => {
  let component: MeshesComponent;
  let fixture: ComponentFixture<MeshesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeshesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeshesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
