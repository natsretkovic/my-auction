import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AuctionState } from '../../store/auction/auction.state';
import * as AuctionActions from '../../store/auction/auction.actions';
import { ItemCategory } from '../../enums/itemCategory.enum';
import { ItemStatus } from '../../enums/itemStatus.enum';
import { Auction } from '../../models/auction.model';
import { selectAuctionLoading, selectAuctionError } from '../../store/auction/auction.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-auction-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './auction-modal.html',
  styleUrls: ['./auction-modal.css']
})
export class AddAuctionModalComponent {
  form: FormGroup;
  categories = Object.values(ItemCategory);
  statuses = Object.values(ItemStatus);

  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddAuctionModalComponent>,
    private store: Store
  ) {
    this.form = this.fb.group({
      naziv: ['', Validators.required],
      opis: ['', Validators.required],
      kategorija: ['', Validators.required],
      stanje: ['', Validators.required],
      startingPrice: [0, [Validators.required, Validators.min(1)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      slike: ['']
    });

    this.loading$ = this.store.select(selectAuctionLoading);
    this.error$ = this.store.select(selectAuctionError);
  }

  submit() {
    if (this.form.valid) {
      const dto = this.form.value;
      this.store.dispatch(AuctionActions.addAuction({ auction: dto }));
    }
  }

  close() {
    this.dialogRef.close();
  }
}