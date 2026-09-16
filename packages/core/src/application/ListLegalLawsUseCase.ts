import { VENEZUELAN_LAWS } from '../domain/catalogs/laws';
import type { LegalLawCategory } from '../domain/LegalLaw';

export class ListLegalLawsUseCase {
  execute(): LegalLawCategory[] {
    return VENEZUELAN_LAWS;
  }
}