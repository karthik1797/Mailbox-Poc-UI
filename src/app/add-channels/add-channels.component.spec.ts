import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChannelsComponent } from './add-channels.component';

describe('AddChannelsComponent', () => {
  let component: AddChannelsComponent;
  let fixture: ComponentFixture<AddChannelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddChannelsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddChannelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
