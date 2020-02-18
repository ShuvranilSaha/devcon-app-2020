import {PreferenceKeys} from '../../../config/preference-keys';

export class Profile {
  get name(): string | null {
    return localStorage.getItem(PreferenceKeys.ProfileAttributes.NAME_ATTRIBUTE);
  }

  get osid(): string | null {
    return localStorage.getItem(PreferenceKeys.ProfileAttributes.OSID_ATTRIBUTE);
  }

  get code(): string | null {
    return localStorage.getItem(PreferenceKeys.ProfileAttributes.OSID_ATTRIBUTE);
  }
}
