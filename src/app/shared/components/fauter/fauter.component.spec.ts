import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FauterComponent } from './fauter.component';

describe('FauterComponent', () => {
  let component: FauterComponent;
  let fixture: ComponentFixture<FauterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FauterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FauterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
