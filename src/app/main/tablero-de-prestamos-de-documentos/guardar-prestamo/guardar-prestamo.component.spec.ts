import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardarPrestamoComponent } from './guardar-prestamo.component';

describe('GuardarPrestamoComponent', () => {
  let component: GuardarPrestamoComponent;
  let fixture: ComponentFixture<GuardarPrestamoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuardarPrestamoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardarPrestamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
