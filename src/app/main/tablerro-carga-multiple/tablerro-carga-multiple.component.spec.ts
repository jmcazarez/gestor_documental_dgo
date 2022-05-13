import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablerroCargaMultipleComponent } from './tablerro-carga-multiple.component';

describe('TablerroCargaMultipleComponent', () => {
  let component: TablerroCargaMultipleComponent;
  let fixture: ComponentFixture<TablerroCargaMultipleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablerroCargaMultipleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablerroCargaMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
