import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'space-filled-site';

  public email(): void {
    const emailSubject = 'Your websites are fucking amazing!';
    const emailBody = 'Dear Omar, your websites are fantastic you truly are a god of web design';
    const mailtoLink = `mailto:omar.mauri98@hotmail.com?subject=${emailSubject}&body=${emailBody}`;

    window.location.href = mailtoLink;
  }
}
