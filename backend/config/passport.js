import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import doctorModel from "../model/Doctor.js";
import patientModel from "../model/Patient.js";
import dotenv from 'dotenv'

dotenv.config();

passport.use(
    "google",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URI,
            passReqToCallback: true,
        },

        async (req, accessToken, refreshToken, profile, done) => {
            try {
                const userType = req.query.state || "patient";
                const { emails, displayName, photos } = profile;
                const email = emails?.[0]?.value;
                const photo = photos?.[0]?.value;

                if (userType === "doctor") {
                    let user = await doctorModel.findOne({ email });
                    if (!user) {
                        user = await doctorModel.create({
                            googleId: profile.id,
                            email,
                            name: displayName,
                            profileImage: photo,
                            isVerified: true,
                        });
                    } else {
                        if (!user.googleId) {
                            user.googleId = profile._id;
                            user.profileImage = photo;
                            await user.save();
                        }
                    }

                    return done(null, { user, types: "doctor" });
                } else {
                    let user = await patientModel.findOne({ email });
                    if (!user) {
                        user = await patientModel.create({
                            googleId: profile.id,
                            email,
                            name: displayName,
                            profileImage: photo,
                            isVerified: true,
                        });
                    } else {
                        if (!user._googleId) {
                            user.googleId = profile._id;
                            user.profileImage = photo;
                            await user.save();
                        }
                    }

                    return done(null, { user, types: "patient" });
                }
            } catch (error) {
                return done(error);
            }
        }
    )
);

export default passport;