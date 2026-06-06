import { inject, Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private document = inject(DOCUMENT);
  private storageKey = 'tpif-theme';

  isDark = signal(true);

  constructor() {
    this.loadTheme();
  }

  private loadTheme(): void {
    const saved = localStorage.getItem(this.storageKey);
    if (saved === 'light' || saved === 'dark') {
      this.isDark.set(saved === 'dark');
    } else {
      // Default to dark
      this.isDark.set(true);
    }
    this.applyTheme();
  }

  toggle(): void {
    this.isDark.set(!this.isDark());
    localStorage.setItem(this.storageKey, this.isDark() ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme(): void {
    const html = this.document.documentElement;
    if (this.isDark()) {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.setAttribute('data-theme', 'light');
    }
  }
}
