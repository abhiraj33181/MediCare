import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet'
import morgan from 'morgan';
import cors from 'cors'
import bodyParser from 'body-parser';
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


app.get('/health', (req,res) => {
    res.ok({time : new Date().toISOString()}, 'OK')
})

const PORT = process.env.PORT

app.listen(PORT, ()=> {
    console.log(`Server Listening on ${PORT}`)
})