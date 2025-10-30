import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AuctionEntityState } from '../../store/auction/auction.state';
import * as AuctionActions from '../../store/auction/auction.actions';
import { ItemCategory } from '../../enums/itemCategory.enum';
import { ItemStatus } from '../../enums/itemStatus.enum';
import { selectAuctionLoading, selectAuctionError } from '../../store/auction/auction.selectors';
import { Observable } from 'rxjs';
import { SupabaseService } from '../../services/supabase.service';

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
  minDate: string = '';

  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  selectedFiles: File[] = [];
  previewImages: string[] = [];
  fileError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddAuctionModalComponent>,
    private store: Store<AuctionEntityState>,
    private supabaseService: SupabaseService
  ) {
    const now = new Date();
    this.minDate = now.toISOString().slice(0, 16);
    this.form = this.fb.group({
      naziv: ['', Validators.required],
      opis: ['', Validators.required],
      kategorija: ['', Validators.required],
      stanje: ['', Validators.required],
      startingPrice: [0, [Validators.required, Validators.min(1)]],
      //startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });

    this.loading$ = this.store.select(selectAuctionLoading);
    this.error$ = this.store.select(selectAuctionError);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const newFiles = Array.from(input.files);
    const combinedFiles = [...this.selectedFiles, ...newFiles];

    if (combinedFiles.length < 1 || combinedFiles.length > 2) {
        this.fileError = 'Minimalan broj slika je 1 a maksimalan 2!';
        return;
      }

    this.selectedFiles = combinedFiles;
    this.fileError = null;

    this.previewImages = this.selectedFiles.map(file => URL.createObjectURL(file));
  }

  async submit() {
    if (this.form.invalid || this.fileError) return;

    const imageUrls: string[] = [];
    for (const file of this.selectedFiles) {
      const url = await this.supabaseService.uploadFile(file);
      if (url) imageUrls.push(url);
    }

    if (imageUrls.length === 0) {
      this.fileError = 'Došlo je do greške pri uploadu slika.';
      return;
    }

    this.store.dispatch(AuctionActions.addAuction({ 
    auction: { ...this.form.value, slike: imageUrls } 
    }));

    this.form.reset();
    this.selectedFiles = [];
    this.previewImages = [];
    this.fileError = null;

    this.dialogRef.close();
  }

  close() {
    this.form.reset();
    this.selectedFiles = [];
    this.previewImages = [];
    this.fileError = null;
    this.dialogRef.close();
  }
}
