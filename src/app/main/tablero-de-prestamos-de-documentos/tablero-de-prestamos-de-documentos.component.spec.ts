import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableroDePrestamosDeDocumentosComponent } from './tablero-de-prestamos-de-documentos.component';

describe('TableroDePrestamosDeDocumentosComponent', () => {
  let component: TableroDePrestamosDeDocumentosComponent;
  let fixture: ComponentFixture<TableroDePrestamosDeDocumentosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableroDePrestamosDeDocumentosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableroDePrestamosDeDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
