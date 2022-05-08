const express = require('express');
const app = express();
const mongoose = require('mongoose')
const dotenv = require('dotenv')

//import routes
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const courseRoute = require('./routes/courses')
const lessonRoute = require('./routes/lesson')
const historyRoute = require('./routes/history')

dotenv.config()


//Connect to db
mongoose.connect(process.env.DB_CONNECT, 
() => console.log('connected to DB'));

//Middleware

app.use(express.json());

//Route Middlewares
app.use('/api/user', authRoute)
app.use('/api/posts', postRoute);
app.use('/api/courses', courseRoute);
app.use('/api/lesson', lessonRoute);
app.use('/api/history', historyRoute);

app.listen(3000, () => console.log('Server up and running'));