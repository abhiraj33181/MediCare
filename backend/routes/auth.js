import express from "express";
import validate from "../middlewares/validate.js";
import doctorModel from "../model/Doctor.js";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import patientModel from "../model/Patient.js";

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