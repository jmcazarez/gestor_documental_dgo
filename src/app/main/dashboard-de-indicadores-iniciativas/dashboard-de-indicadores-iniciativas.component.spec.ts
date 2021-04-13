import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDeIndicadoresIniciativasComponent } from './dashboard-de-indicadores-iniciativas.component';

describe('DashboardDeIndicadoresIniciativasComponent', () => {
  let component: DashboardDeIndicadoresIniciativasComponent;
  let fixture: ComponentFixture<DashboardDeIndicadoresIniciativasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardDeIndicadoresIniciativasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDeIndicadoresIniciativasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
