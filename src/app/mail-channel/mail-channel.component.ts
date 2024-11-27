import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MailService } from 'src/services/mail.service';

@Component({
  selector: 'app-mail-channel',
  templateUrl: './mail-channel.component.html',
  styleUrls: ['./mail-channel.component.scss']
})
export class MailChannelComponent {

  email: string  = "";
  mails: any[] = [];
  accessToken: string | null = null;
  selectedMail: any = null;
  showComposePopup: boolean = false;
  composeForm: FormGroup = new FormGroup({});
  inboxData: any;
  constructor(private mailService: MailService,  private fb: FormBuilder,private route: ActivatedRoute,  private sanitizer: DomSanitizer) { 
    this.generateComposeForm()
  }


  ngOnInit(): void {
    // this.route.queryParams.subscribe(params => {
    //   const code = params['code'];
    //   if (code) {
    //     this.mailService.getToken(code).subscribe((response: any) => {
    //       console.log('Access Token:', response);
    //       this.accessToken = response.access_token;
    //       if (this.accessToken) {
    //         localStorage.setItem('accessToken', this.accessToken);
    //         this.getInboxMails(this.accessToken);
    //         window.history.replaceState({}, document.title, window.location.pathname);
    //       }
    //     });
    //   } else {
    //     this.accessToken = localStorage.getItem('accessToken');
    //     if (this.accessToken) {
    //       this.getInboxMails(this.accessToken);
    //     }
    //   }
    // });
    this.inboxData = JSON.parse(localStorage.getItem('Inbox') || '[]');
  }

  selectInbox(inbox: any) {
    this.accessToken = inbox.accessToken
        if (this.accessToken) {
          if(inbox.provider === 'outlook'){
            this.getInboxMails(this.accessToken);
          }
      
        }
  }

  generateComposeForm() {
    this.composeForm = this.fb.group({
      to: [''],
      subject: [''],
      body: ['']
    });
  }

  getInboxMails(accessToken: string): void {
    this.mailService.getInboxMails(accessToken).subscribe((mails: any) => {
      this.mails = mails.value;
      this.selectedMail = this.mails[0];
      console.log('Inbox Mails:', this.mails);
    }, error => {
      console.error('Error fetching inbox mails:', error);
      this.signInOutlook();
    });
  }
  

  selectMail(mail: any): void {
    this.selectedMail = mail;
  }

  signInOutlook() {
    this.mailService.authorizeOutlook();

  }

  sanitizeHtml(html: string): SafeHtml {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const images = tempDiv.getElementsByTagName('img');
    while (images.length > 0) {
      images[0].parentNode?.removeChild(images[0]);
    }
    return this.sanitizer.bypassSecurityTrustHtml(tempDiv.innerHTML);
  }

  openComposePopup(): void {
    this.composeForm.patchValue({
      to: this.selectedMail.from.emailAddress.address,
      subject: `Re: ${this.selectedMail.subject}`,
      body: ``
    });
    this.showComposePopup = true;
  }

  closeComposePopup(): void {
    this.showComposePopup = false;
  }

  sendMail(): void {
    if (this.accessToken) {
      const composeMail = this.composeForm.value;
      const email = {
        message: {
          subject: composeMail.subject,
          body: {
            contentType: 'Text',
            content: composeMail.body
          },
          toRecipients: [
            {
              emailAddress: {
                address: composeMail.to
              }
            }
          ]
        },
        saveToSentItems: 'true'
      };
      this.mailService.sendMail(this.accessToken, email).subscribe(response => {
        console.log('Mail sent successfully:', response);
        this.closeComposePopup();
      }, error => {
        console.error('Error sending mail:', error);
      });
    }
  }
}
