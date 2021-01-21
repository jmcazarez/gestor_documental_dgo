import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkPublicoComponent } from './link-publico.component';

describe('LinkPublicoComponent', () => {
  let component: LinkPublicoComponent;
  let fixture: ComponentFixture<LinkPublicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkPublicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkPublicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
