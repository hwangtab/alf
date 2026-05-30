export type NewsletterBlock =
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'image'; src: string; alt: string }
  | { type: 'link'; text: string; href: string }
  | { type: 'video'; url: string; title?: string }
  | { type: 'ledger'; month: string };

export type LedgerEntry = { label: string; amount: number; note?: string };
export type AccountingMonth = {
  income: LedgerEntry[];
  expense: LedgerEntry[];
  totalIncome: number;
  totalExpense: number;
  net: number;
  prevBalance: number;
  currentBalance: number;
};
