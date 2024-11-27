import { Component } from '@angular/core';
import { MailService } from 'src/services/mail.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-channels',
  templateUrl: './add-channels.component.html',
  styleUrls: ['./add-channels.component.scss']
})
export class AddChannelsComponent {
  accessToken: string | null = null;
  inboxName: string = "";
  code:  string | null = null;
  constructor(private mailService: MailService,private route: ActivatedRoute) { 
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.code = params['code'];
      if (this.code) {
        this.mailService.getToken(this.code).subscribe((response: any) => {
          console.log('Access Token:', response);
          this.accessToken = response.access_token;
          // if (this.accessToken) {
          //   // localStorage.setItem('accessToken', this.accessToken);
          //   window.history.replaceState({}, document.title, window.location.pathname);
          // }
        });
      } 
    });
  }

  signInOutlook() {
    this.mailService.authorizeOutlook();
  }

  saveInbox(providerName:string) {
    const inboxDetails = {
      "accessToken": this.accessToken,
      "inboxName": this.inboxName,
      "provider": providerName
    }
    let inbox = JSON.parse(localStorage.getItem('Inbox') || '[]');

      inbox.push(inboxDetails);

    window.history.replaceState({}, document.title, window.location.pathname);
    this.code = null
      localStorage.setItem("Inbox", JSON.stringify(inbox));
  }

}
