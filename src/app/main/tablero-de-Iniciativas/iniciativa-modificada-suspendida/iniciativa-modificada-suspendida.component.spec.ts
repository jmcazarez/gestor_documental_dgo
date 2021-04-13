import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IniciativaModificadaSuspendidaComponent } from './iniciativa-modificada-suspendida.component';

describe('IniciativaModificadaSuspendidaComponent', () => {
  let component: IniciativaModificadaSuspendidaComponent;
  let fixture: ComponentFixture<IniciativaModificadaSuspendidaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IniciativaModificadaSuspendidaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IniciativaModificadaSuspendidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
