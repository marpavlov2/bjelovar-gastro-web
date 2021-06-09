import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodExtrasDialogComponent } from './food-extras-dialog.component';

describe('FoodExtrasDialogComponent', () => {
  let component: FoodExtrasDialogComponent;
  let fixture: ComponentFixture<FoodExtrasDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodExtrasDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodExtrasDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
