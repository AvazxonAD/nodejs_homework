const express = require('express');
const handlebars = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const path = require('path')
const morgan = require('morgan')

const colors = require('colors');
const connectDB = require('./config/db');

const app = express();

const dotenv = require('dotenv');
dotenv.config();

connectDB();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.engine('.hbs', handlebars.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');

if(process.env.NODE_ENV ==='development'){
    app.use(morgan('dev'))
}

app.use(express.static(path.join(__dirname, './public')))


const sessionStore = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collection: 'sessions',
    mongooseConnection: mongoose.connection
});

app.use(session({
    secret: 'your-secret-key-here', 
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 } 
}));

app.use(flash());

app.use('/admin', require('./router/admin.router'));
app.use('/user', require('./router/user.router'))


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server run on port :  ${PORT}`.blue);
});
