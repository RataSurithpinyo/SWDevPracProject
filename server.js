// Rata Surithpinyo 6330454721
// ** I am using port 3000 **
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const connectDB = require('./config/db');
dotenv.config({path: './config/config.env' });

connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(cors());

//rate limiting
const limiter = rateLimit({
    windowsMs:10*60*1000, //10 mins
    max: 100
});
app.use(limiter);

const swaggerOptions={
    swaggerDefinition:{
        openapi: '3.0.0',
        info: {
            title: 'Library API',
            version: '1.0.0',
            description: 'A simple Express VacQ API'
        },
        servers: [
            {
                url: 'http://localhost:3000/api/v1'
            }
        ],
    },
    apis:['./routes/*.js'],
};
const swaggerDocs=swaggerJsDoc(swaggerOptions);
app.use('/api-docs',swaggerUI.serve, swaggerUI.setup(swaggerDocs));

const hospitals = require('./routes/hospitals');
const appointments = require('./routes/appointments');
const auth = require('./routes/auth');
app.use('/api/v1/hospitals',hospitals);
app.use('/api/v1/appointments',appointments);
app.use('/api/v1/auth',auth);
//const mongoSanitize = require('express-mongo-sanitize');
//app.use(mongoSanitize());

const PORT = process.env.PORT ;
//app.listen(PORT,console.log('Server running in',process.env.NODE_ENV,'mode on port',PORT));

const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' mode on port ', PORT));

process.on('unhandledRejection', (err,promise)=>{
    console.log(`Error: ${err.message}`);
    server.close(()=>process.exit(1));
});