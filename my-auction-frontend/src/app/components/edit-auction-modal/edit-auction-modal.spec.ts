import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAuctionModal } from './edit-auction-modal';

describe('EditAuctionModal', () => {
  let component: EditAuctionModal;
  let fixture: ComponentFixture<EditAuctionModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAuctionModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAuctionModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
