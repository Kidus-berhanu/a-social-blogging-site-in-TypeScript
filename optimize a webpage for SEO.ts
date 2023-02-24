// Import the required modules
import { Meta } from '@angular/platform-browser';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(private meta: Meta) {}

  // Set the meta tags for the page
  setMetaTags(title: string, description: string, keywords: string) {
    this.meta.updateTag({ name: 'title', content: title });
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: keywords });
  }

  // Set the Open Graph meta tags for social media sharing
  setSocialMetaTags(title: string, description: string, imageUrl: string) {
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
  }

  // Add structured data to the page
  addStructuredData(data: any) {
    this.meta.addTag({ name: 'application/ld+json', content: JSON.stringify(data) });
  }
}
