import express, { response } from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet'
import morgan from 'morgan';
import cors from 'cors'
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import Response from './middlewares/response.js';
import AuthRouter from './routes/auth.js'

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


const PORT = process.env.PORT

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(() => {
    console.log('Connected to DB')
})
.catch(err => {
    console.log("MongoDb Connection Error:: "+ err)
})





app.use('/api/auth', AuthRouter)


app.get('/health', (req,res) => {
    res.ok({time : new Date().toISOString()}, 'OK')
})


app.listen(PORT, ()=> {
    console.log(`Server Listening on ${PORT}`)
})