import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardarSecretariaComponent } from './guardar-secretaria.component';

describe('GuardarSecretariaComponent', () => {
  let component: GuardarSecretariaComponent;
  let fixture: ComponentFixture<GuardarSecretariaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuardarSecretariaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardarSecretariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
