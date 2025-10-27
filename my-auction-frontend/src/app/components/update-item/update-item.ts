import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ItemCategory } from '../../enums/itemCategory.enum';
import { ItemStatus } from '../../enums/itemStatus.enum';
import { UpdateItemDto } from '../../models/dtos/update.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-item',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-item.html',
  styleUrl: './update-item.css'
})
export class UpdateItem {
  @Input() initialData?: UpdateItemDto;
  @Input() categories: ItemCategory[] = [];
  @Input() statuses: ItemStatus[] = [];
  
  @Output() submitUpdate = new EventEmitter<UpdateItemDto>();
  @Output() closeModal = new EventEmitter<void>();

  form: FormGroup;
  previewImages: string[] = [];
  fileError: string | null = null;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      opis: [''],
      kategorija: [''],
      stanje: [''],
      slike: [[]],
    });
  }

  ngOnInit() {
    if (this.initialData) {
      this.form.patchValue(this.initialData);
      if (this.initialData.slike) {
        this.previewImages = [...this.initialData.slike];
      }
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);
    if (files.length > 2) {
      this.fileError = 'Možete dodati najviše 2 slike.';
      return;
    }
    this.fileError = null;

    this.previewImages = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        if (e.target?.result) this.previewImages.push(e.target.result as string);
      };
      reader.readAsDataURL(file);
    });

    this.form.patchValue({ slike: this.previewImages });
  }

  submit() {
    if (this.form.valid) {
      this.submitUpdate.emit(this.form.value);
    }
  }

  close() {
    this.closeModal.emit();
  }

}