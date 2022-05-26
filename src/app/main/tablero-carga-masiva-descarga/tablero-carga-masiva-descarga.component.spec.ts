import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableroCargaMasivaDescargaComponent } from './tablero-carga-masiva-descarga.component';

describe('TableroCargaMasivaDescargaComponent', () => {
  let component: TableroCargaMasivaDescargaComponent;
  let fixture: ComponentFixture<TableroCargaMasivaDescargaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableroCargaMasivaDescargaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableroCargaMasivaDescargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
