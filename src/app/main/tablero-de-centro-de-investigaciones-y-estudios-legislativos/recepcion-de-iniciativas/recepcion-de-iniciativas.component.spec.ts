import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecepcionDeIniciativasComponent } from './recepcion-de-iniciativas.component';

describe('RecepcionDeIniciativasComponent', () => {
  let component: RecepcionDeIniciativasComponent;
  let fixture: ComponentFixture<RecepcionDeIniciativasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecepcionDeIniciativasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecepcionDeIniciativasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
