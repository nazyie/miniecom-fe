import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustedUser } from './trusted-user';

describe('TrustedUser', () => {
  let component: TrustedUser;
  let fixture: ComponentFixture<TrustedUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrustedUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrustedUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
