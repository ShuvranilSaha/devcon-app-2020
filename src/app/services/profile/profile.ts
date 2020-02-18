export class Profile {
  private static INSTANCE?: Profile;

  static instance: Profile = (() => {
    if (!Profile.INSTANCE) {
      Profile.INSTANCE = new Profile();
    }

    return Profile.INSTANCE;
  })();

  osid?: string;
  name?: string;
}
