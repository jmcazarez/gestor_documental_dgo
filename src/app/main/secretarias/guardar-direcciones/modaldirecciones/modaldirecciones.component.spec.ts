import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaldireccionesComponent } from './modaldirecciones.component';

describe('ModaldireccionesComponent', () => {
  let component: ModaldireccionesComponent;
  let fixture: ComponentFixture<ModaldireccionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModaldireccionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaldireccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
