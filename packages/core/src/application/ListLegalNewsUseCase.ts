import { LEGAL_NEWS } from '../domain/catalogs/news';
import type { LegalNewsItem } from '../domain/LegalNews';

export class ListLegalNewsUseCase {
  execute(): LegalNewsItem[] {
    return LEGAL_NEWS;
  }
}