import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasTowlComponent } from './canvas-towl.component';

describe('CanvasTowlComponent', () => {
  let component: CanvasTowlComponent;
  let fixture: ComponentFixture<CanvasTowlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvasTowlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanvasTowlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
