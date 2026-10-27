export interface LegalLawItem {
  title: string;
  meta: string;
}

export interface LegalLawCategory {
  key: string;
  label: string;
  items: LegalLawItem[];
}