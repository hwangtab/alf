import type { NewsletterBlock } from '@/types/newsletter';
import n48 from './newsletters/48.json';
import n49 from './newsletters/49.json';
import n50 from './newsletters/50.json';
import n51 from './newsletters/51.json';
import n52 from './newsletters/52.json';
import n53 from './newsletters/53.json';

export const newsletterContent: Record<number, NewsletterBlock[]> = {
  48: n48 as NewsletterBlock[],
  49: n49 as NewsletterBlock[],
  50: n50 as NewsletterBlock[],
  51: n51 as NewsletterBlock[],
  52: n52 as NewsletterBlock[],
  53: n53 as NewsletterBlock[],
};

export const migratedIds = Object.keys(newsletterContent).map(Number).sort((a, b) => a - b);
