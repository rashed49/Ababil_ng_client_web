import { TranslateService } from '@ngx-translate/core';

export const TRANSLATE_STORAGE_KEY: string = 'ababil-ng-translate-lang';

export function getSelectedLanguage(translateService: TranslateService): string {
  
  const storedLanguage: string = sessionStorage.getItem(TRANSLATE_STORAGE_KEY);
  if (storedLanguage && translateService.getLangs().indexOf(storedLanguage) > -1) {
    return storedLanguage;
  } else if (translateService.getLangs().indexOf(translateService.getBrowserLang()) > -1) {
    return translateService.getBrowserLang();
  }

  return translateService.getDefaultLang();
}