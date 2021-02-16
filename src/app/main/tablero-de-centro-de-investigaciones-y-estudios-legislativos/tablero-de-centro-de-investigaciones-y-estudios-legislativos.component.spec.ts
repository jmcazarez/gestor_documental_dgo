import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableroDeCentroDeInvestigacionesYEstudiosLegislativosComponent } from './tablero-de-centro-de-investigaciones-y-estudios-legislativos.component';

describe('TableroDeCentroDeInvestigacionesYEstudiosLegislativosComponent', () => {
  let component: TableroDeCentroDeInvestigacionesYEstudiosLegislativosComponent;
  let fixture: ComponentFixture<TableroDeCentroDeInvestigacionesYEstudiosLegislativosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableroDeCentroDeInvestigacionesYEstudiosLegislativosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableroDeCentroDeInvestigacionesYEstudiosLegislativosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
