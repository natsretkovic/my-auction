import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionModal } from './auction-modal';

describe('AuctionModal', () => {
  let component: AuctionModal;
  let fixture: ComponentFixture<AuctionModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuctionModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuctionModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
