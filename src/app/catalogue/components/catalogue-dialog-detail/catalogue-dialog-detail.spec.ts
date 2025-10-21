import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueDialogDetail } from './catalogue-dialog-detail';

describe('CatalogueDialogDetail', () => {
  let component: CatalogueDialogDetail;
  let fixture: ComponentFixture<CatalogueDialogDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogueDialogDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogueDialogDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
