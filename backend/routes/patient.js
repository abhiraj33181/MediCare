import express from 'express'
import { body } from 'express-validator';
import { computeAgeFromDOB } from '../utils/date.js';
import patientModel from '../model/Patient.js'
import { authenticate, requireRole } from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';

const router = express.Router()

// get the profile of the doctor 
router.get('/me', authenticate, requireRole('doctor'), async (req, res) => {
    try {
        const doc = await doctorModel.findById(req.user.id).select('-password -googleId');
        res.ok(doc, 'Profile Fetched')

    } catch (error) {
        console.log('API : /me ::', error.message)
    }
})

// update doctor profile 

router.put('onboarding/update', authenticate, requireRole('doctor'), [
    body('name').optional().notEmpty(),
    body('phone').optional().isString(),
    body('dob').optional().isISO8601(),
    body('gender').optional().isIn(["male", "female", "other"]),
    body('bloodGroup').optional().isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),

    body('emergenecyContact').optional().isObject(),
    body('emergenecyContact.name').optional().isString().notEmpty(),
    body('emergenecyContact.phone').optional().isString().notEmpty(),
    body('emergenecyContact.relationship').optional().isString().notEmpty(),

    body('medicalHistory').optional().isObject(),
    body('medicalHistory.allergies').optional().isString().notEmpty(),
    body('medicalHistory.currentMedications').optional().isString().notEmpty(),
    body('medicalHistory.chronicConditions').optional().isString().notEmpty(),
], validate, async (req, res) => {
    try {
        const updated = {...req.body};

        if (uodated.dob){
            updated.age = computeAgeFromDOB(updated.dob)
        }
        delete updated.password;
        updated.isVerified = true;
        const patient = await patientModel.findByIdAndUpdate(req.user._id, updated, {new : true}).select('-password -googleId')

        res.ok('Profile Updated!!')
    } catch (error) {
        res.serverError("Updation Failed", [error.message])
    }
})

export default router;