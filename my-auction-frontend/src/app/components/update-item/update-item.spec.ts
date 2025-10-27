import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateItem } from './update-item';

describe('UpdateItem', () => {
  let component: UpdateItem;
  let fixture: ComponentFixture<UpdateItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
