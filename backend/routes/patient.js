import express from 'express'

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
    body('speacilization').optional().notEmpty(),
    body('qualification').optional().notEmpty(),
    body('category').optional().notEmpty(),
    body('experience').optional().isInt({ min: 0 }),
    body('fees').optional().isInt({ min: 0 }),
    body('hospitalInfo').optional().isObject(),
    body('availablityRange.startDate').optional().isISO8601(),
    body('availablityRange.endDate').optional().isISO8601(),
    body('availablityRange.excludeWeekdays').optional().isArray(),
    body('dailyTimeRange').isArray({ min: 1 }),
    body('dailyTimeRange.*.start').isString(),
    body('dailyTimeRange.*.end').isString(),
    body('slowDurationMinutes').optional().isInt({ min: 5, max: 180 })
], validate, async (req, res) => {
    try {
        const updated = {...req.body};
        delete updated.password;
        updated.isVerified = true;
        const doc = await doctorModel.findByIdAndUpdate(req.user._id, updated, {new : true}).select('-password -googleId')

        res.ok('Profile Updated!!')
    } catch (error) {
        res.serverError("Updation Failed", [error.message])
    }
})