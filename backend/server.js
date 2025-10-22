import express, { response } from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet'
import morgan from 'morgan';
import cors from 'cors'
import Response from './middlewares/response.js';
import bodyParser from 'body-parser';
import AuthRouter from './routes/auth.js'
import patientRouter from './routes/patient.js';
import doctorRouter from './routes/doctor.js';

import passport from './config/passport.js'
import passportLib from 'passport'


import dotenv from 'dotenv';
dotenv.config()


const app = express()

app.use(helmet())
app.use(morgan('dev'))
app.use(cors({
    origin : (process.env.ALLOWED_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean) || '*',
    credentials : true,
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))

app.use(Response)
app.use(passportLib.initialize())


const PORT = process.env.PORT

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(() => {
    console.log("🧠 Database connection established — all systems go!")
})
.catch(err => {
    console.log("MongoDb Connection Error:: "+ err)
})



app.use('/api/auth', AuthRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/patient', patientRouter)


app.get('/health', (req,res) => {
    res.ok({time : new Date().toISOString()}, 'OK')
})


app.listen(PORT, ()=> {
    console.log("\n\n🚀 Server started successfully at http://localhost:8080");
})