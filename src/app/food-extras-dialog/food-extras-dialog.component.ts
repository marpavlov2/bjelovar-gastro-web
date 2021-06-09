import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-food-extras-dialog',
  templateUrl: './food-extras-dialog.component.html',
  styleUrls: ['./food-extras-dialog.component.scss']
})
export class FoodExtrasDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<FoodExtrasDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

  filter(data: any) {
    if (data) {
      return data.filter((foodExtra) => {
        if (foodExtra.checked) {
          return foodExtra;
        }
      })
    }
  }

}
