import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMeshComponent } from './new-mesh.component';

describe('NewMeshComponent', () => {
  let component: NewMeshComponent;
  let fixture: ComponentFixture<NewMeshComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewMeshComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewMeshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
