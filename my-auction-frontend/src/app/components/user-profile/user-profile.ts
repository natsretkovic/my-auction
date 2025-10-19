import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { AddAuctionModalComponent } from '../auction-modal/auction-modal';


@Component({
  selector: 'app-user-profile',
  imports: [MatDialogModule, CommonModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})

export class UserProfileComponent implements OnInit {
  user$!: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.user$ = this.authService.getProfile();
  }

  openAddAuctionModal() {
    this.dialog.open(AddAuctionModalComponent, {
      width: '500px',
    });
  }
}

