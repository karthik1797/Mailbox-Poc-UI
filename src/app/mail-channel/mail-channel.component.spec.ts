import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailChannelComponent } from './mail-channel.component';

describe('MailChannelComponent', () => {
  let component: MailChannelComponent;
  let fixture: ComponentFixture<MailChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailChannelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MailChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
