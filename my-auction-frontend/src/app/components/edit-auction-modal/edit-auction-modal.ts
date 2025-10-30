import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AuctionEntityState } from '../../store/auction/auction.state';
import * as AuctionActions from '../../store/auction/auction.actions';
import { ItemCategory } from '../../enums/itemCategory.enum';
import { ItemStatus } from '../../enums/itemStatus.enum';
import { SupabaseService } from '../../services/supabase.service';
import { Auction } from '../../models/auction.model';

@Component({
  selector: 'app-edit-auction-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './edit-auction-modal.html',
  styleUrls: ['./edit-auction-modal.css']
})
export class EditAuctionModal implements OnInit {

  form: FormGroup;
  categories = Object.values(ItemCategory);
  statuses = Object.values(ItemStatus);
  selectedFiles: File[] = [];
  previewImages: string[] = [];
  fileError: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditAuctionModal>,
    private store: Store<AuctionEntityState>,
    private supabaseService: SupabaseService,
    @Inject(MAT_DIALOG_DATA) public data: Auction
  ) {
    this.form = this.fb.group({
      naziv: ['', Validators.required],
      opis: ['', Validators.required],
      kategorija: ['', Validators.required],
      stanje: ['', Validators.required],
    });
  }

  ngOnInit() {
    const item = this.data.item;
    const now = new Date();
    this.form.patchValue({
      naziv: item.naziv,
      opis: item.opis,
      kategorija: item.kategorija,
      stanje: item.stanje,
    });
    this.previewImages = [...(item.slike ?? [])];
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

    let imageUrls: string[] = [];

    if (this.selectedFiles.length > 0) {
      for (const file of this.selectedFiles) {
        const url = await this.supabaseService.uploadFile(file);
        if (url) imageUrls.push(url);
      }
    }

    if (imageUrls.length === 0) imageUrls.push(...this.previewImages);

    const updateData = {
        naziv: this.form.value.naziv,
        opis: this.form.value.opis,
        kategorija: this.form.value.kategorija,
        stanje: this.form.value.stanje,
        slike: imageUrls
      
    };

    this.dialogRef.close(updateData);
  }

  close() {
    this.dialogRef.close();
  }
}
