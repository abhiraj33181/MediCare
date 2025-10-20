import JWT from 'jsonwebtoken'
import patientModel from '../model/Patient.js'
import doctortModel from '../model/Doctor.js'


export async function authenticate(req, res, next) {
    try {
        const header = req.headers.authorization
        const token = header.startsWith('Bearer ') ? header.slice(7) : null;

        if (!token) return res.unauthorized("Missing Token!")

        const decode = JWT.verify(token, process.env.JWT_SECRET);

        req.auth = decode
        if (decode.type === 'doctor') {
            req.user = await doctortModel.findById(decode._id)
        } else if (decode.type === 'patient') {
            req.user = await patientModel.findById(decode._id)
        }

        if (!req.user) return res.unauthorized("Invalid User")
        next()
    } catch (error) {
        return res.unauthorized("Invalid or expired token")
    }
}

export const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.auth || req.auth.type != role) {
            return res.forbidden("Insuffieient Role Permission!!")
        }
        next()
    }
}