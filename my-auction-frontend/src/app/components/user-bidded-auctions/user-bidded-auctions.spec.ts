import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBiddedAuctions } from './user-bidded-auctions';

describe('UserBiddedAuctions', () => {
  let component: UserBiddedAuctions;
  let fixture: ComponentFixture<UserBiddedAuctions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserBiddedAuctions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserBiddedAuctions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
