import express from "express";
import validate from "../middlewares/validate.js";
import { body } from "express-validator";
import doctorModel from "../model/Doctor.js";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import patientModel from "../model/Patient.js";
import passport from "passport";

const router = express.Router();

const signToken = (id, type) => {
    JWT.sign({ id, type }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

router.post(
    "/doctor/register",
    [
        body("name").notEmpty(),
        body("email").isEmail(),
        body("password").isLength({ min: 6 }),
    ],
    validate,
    async (req, res) => {
        try {
            const exist = await doctorModel.findOne({ email: req.body.email });
            if (!exist) return res.badRequest("Doctor Already Exist");

            const hashed = await bcrypt.hash(req.body.password, 10);
            const doc = await doctorModel.create({
                ...req.body,
                password: hashed,
            });

            const token = signToken(doc._id, "doctor");
            res.created(
                { token, user: { id: doc._id, type: "doctor" } },
                "Doctor Registered"
            );
        } catch (error) {
            res.serverError("Registration Failed", [error.message]);
        }
    }
);


router.post(
    "/doctor/login",
    [
        body("email").isEmail(),
        body("password").isLength({ min: 6 }),
    ],
    validate,
    async (req, res) => {
        try {
            const doctor = await doctorModel.findOne({ email: req.body.email });
            if (!doctor || !doctor.password) return res.unauthorized("Invalid Credentials!");

            const isMatch = bcrypt.compare(password, doctor.password)

            if (!isMatch) {
                return res.unauthorized('Invalid Credentails')
            }

            const token = signToken(doctor._id, "doctor");
            res.created(
                { token, user: { id: doctor._id, type: "doctor" } },
                "Login Successful"
            );
        } catch (error) {
            res.serverError("Registration Failed", [error.message]);
        }
    }
);


// patient 
router.post(
    "/patient/register",
    [
        body("name").notEmpty(),
        body("email").isEmail(),
        body("password").isLength({ min: 6 }),
    ],
    validate,
    async (req, res) => {
        try {
            const exist = await patientModel.findOne({ email: req.body.email });
            if (!exist) return res.badRequest("Patient Already Exist");

            const hashed = await bcrypt.hash(req.body.password, 10);
            const patient = await patientModel.create({
                ...req.body,
                password: hashed,
            });

            const token = signToken(patient._id, "patient");
            res.created(
                { token, user: { id: patient._id, type: "patient" } },
                "Patient Registered"
            );
        } catch (error) {
            res.serverError("Registration Failed", [error.message]);
        }
    }
);


router.post(
    "/patient/login",
    [
        body("email").isEmail(),
        body("password").isLength({ min: 6 }),
    ],
    validate,
    async (req, res) => {
        try {
            const patient = await patientModel.findOne({ email: req.body.email });
            if (!patient || !patient.password) return res.unauthorized("Invalid Credentials!");

            const isMatch = bcrypt.compare(password, patient.password)

            if (!isMatch) {
                return res.unauthorized('Invalid Credentails')
            }

            const token = signToken(patient._id, "patient");
            res.created(
                { token, user: { id: patient._id, type: "patient" } },
                "Login Successfull"
            );
        } catch (error) {
            res.serverError("Registration Failed", [error.message]);
        }
    }
);




// Google Oauth Start 

router.get('/google', (req,res,next) => {
    const userType = req.query.type || 'patient'

    passport.authenticate('google', {
        scope : ['profile', 'email'],
        state : userType,
        prompt : select_account
    })(req,res,next)
})


router.get('/google/callback', passport.authenticate('google', {
    session : false,
    failureRedirect : '/auth/failure'
}), async (req,res) => {
    try {
        const {user, type} = req.user;
        const token = signToken(user._id, type);

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const redirectURL = `${frontendUrl}/auth/success?token${token}&type=${type}&users=${encodedURIComponent(JSON.stringify({
            id: user._id,
            name : user.name,
            email : user.email,
            profileImage : user.profileImage,
        }))}`

        res.redirect(redirectURL)
    } catch (error) {
        res.redirect(`${process.env.FRONTEND_URL}/auth/error?message${encodedURIComponent(error.message)}`)
    }
})

router.get('/failure', (req,res) => {
    res.badRequest('Google Authentication Failed')
})

export default router