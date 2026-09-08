import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { PayPeriodCard } from './components/pay-period-card/pay-period-card';
import { SettingsSheet } from './components/settings-sheet/settings-sheet';
import { EnvelopeFormSheet } from './components/envelope-form-sheet/envelope-form-sheet';
import { Toast } from './components/toast/toast';

@Component({
  selector: 'app-root',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    Header,
    PayPeriodCard,
    SettingsSheet,
    EnvelopeFormSheet,
    Toast,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
