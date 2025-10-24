import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAuctions } from './show-auctions';

describe('ShowAuctions', () => {
  let component: ShowAuctions;
  let fixture: ComponentFixture<ShowAuctions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowAuctions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowAuctions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
