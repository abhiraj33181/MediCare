import express from 'express'
import doctorModel from '../model/Doctor.js'
import validate from '../middlewares/validate'
import { authenticate, requireRole } from '../middlewares/auth.js'


const router = express.Router()

router.get('/list', [
    query('search').optional().isString,
    query('speacilization').optional().isString,
    query('city').optional().isString,
    query('category').optional().isString,
    query('minFees').optional().isInt({ min: 0 }),
    query('maxFees').optional().isInt({ min: 0 }),
    query('sortBy').optional().isIn(['fees', 'experience', 'name', 'createdAt']),
    query('sortOrder').optional().isIn(['asc', 'desc']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
], validate, async (req, res) => {
    try {
        const { search, speacilization, city, category, minFees, maxFees, sortBy = 'CreatedAt', sortOrder = 'desc', page = 1, limit = 20 } = req.query

        const filter = { isVerified: true };

        if (speacilization) filter.speacilization = { $regex: `${speacilization}$`, $options: "i" }
        if (city) filter['hospitalInfo.city'] = { $regex: city, $options: "i" }
        if (category) filter.category = category;

        if (minFees || maxFees) {
            filter.fees = {};
            if (minFees) filter.fees.$gte = Number(minFees)
            if (maxFees) filter.fees.$lte = Number(maxFees)
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { speacilization: { $regex: search, $options: 'i' } },
                { "hospitalInfo.name": { $regex: search, $options: 'i' } },
            ]
        }

        const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        const skip = (Number(page) - 1) * Number(limit);

        const [item, total] = await Promise.all([
            doctorModel.find(filter).select('-password -googleId').sort(sort).skip(skip).limit(Number(limit)),
            doctorModel.countDocuments(fiilter)
        ])

        res.ok(items, "Doctor Fetched", { page: Number(page), limit: Number(limit), total })

    } catch (error) {
        console.error("Doctor Fetched Failed", error.message)
        res.serverError("Doctor Fetched Failed!", [error.message])
    }
})


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