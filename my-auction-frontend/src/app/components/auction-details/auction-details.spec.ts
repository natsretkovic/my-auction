import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionDetails } from './auction-details';

describe('AuctionDetails', () => {
  let component: AuctionDetails;
  let fixture: ComponentFixture<AuctionDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuctionDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuctionDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
