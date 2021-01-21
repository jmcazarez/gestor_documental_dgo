import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardarEmpleadoComponent } from './guardar-empleado.component';

describe('GuardarEmpleadoComponent', () => {
  let component: GuardarEmpleadoComponent;
  let fixture: ComponentFixture<GuardarEmpleadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuardarEmpleadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardarEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
