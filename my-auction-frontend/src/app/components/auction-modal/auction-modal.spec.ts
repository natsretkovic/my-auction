import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAuctionModalComponent } from './auction-modal';

describe('AuctionModal', () => {
  let component: AddAuctionModalComponent;
  let fixture: ComponentFixture<AddAuctionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAuctionModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAuctionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
