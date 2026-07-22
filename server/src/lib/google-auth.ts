import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } from "@/config";

export type GoogleAuthUser = {
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
};

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("Google account has no email"), undefined);

        const user: GoogleAuthUser = {
          googleId: profile.id,
          email,
          name: profile.displayName ?? email.split("@")[0],
          avatar: profile.photos?.[0]?.value,
        };

        return done(null, user);
      } catch (err) {
        return done(err as Error, undefined);
      }
    },
  ),
);

export const passportAuthGoogle = passport;
