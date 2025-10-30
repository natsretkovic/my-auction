import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiderBar } from './sider-bar';

describe('SiderBar', () => {
  let component: SiderBar;
  let fixture: ComponentFixture<SiderBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiderBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiderBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
