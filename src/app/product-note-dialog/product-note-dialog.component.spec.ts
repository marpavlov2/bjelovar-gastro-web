import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductNoteDialogComponent } from './product-note-dialog.component';

describe('FoodExtrasDialogComponent', () => {
  let component: ProductNoteDialogComponent;
  let fixture: ComponentFixture<ProductNoteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductNoteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductNoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
