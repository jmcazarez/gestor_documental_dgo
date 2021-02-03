import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableroDeInventarioFisicoComponent } from './tablero-de-inventario-fisico.component';

describe('TableroDeInventarioFisicoComponent', () => {
  let component: TableroDeInventarioFisicoComponent;
  let fixture: ComponentFixture<TableroDeInventarioFisicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableroDeInventarioFisicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableroDeInventarioFisicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
