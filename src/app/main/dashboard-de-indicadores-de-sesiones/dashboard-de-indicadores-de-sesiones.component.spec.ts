import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDeIndicadoresDeSesionesComponent } from './dashboard-de-indicadores-de-sesiones.component';

describe('DashboardDeIndicadoresDeSesionesComponent', () => {
  let component: DashboardDeIndicadoresDeSesionesComponent;
  let fixture: ComponentFixture<DashboardDeIndicadoresDeSesionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardDeIndicadoresDeSesionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDeIndicadoresDeSesionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
