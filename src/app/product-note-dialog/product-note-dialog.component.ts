import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-product-note-dialog',
  templateUrl: './product-note-dialog.component.html',
  styleUrls: ['./product-note-dialog.component.scss']
})
export class ProductNoteDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ProductNoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
