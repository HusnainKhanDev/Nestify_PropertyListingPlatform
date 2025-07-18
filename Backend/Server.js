const express  = require('express');
const dotenv = require('dotenv');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
dotenv.config();
const Port = process.env.PORT
const UserRouter = require('./Routers/UserRoutes');
const PropertyRouter = require('./Routers/PropertyRoutes');



//SERVER CONFIG -------------------------------------------------------------------------
const server = http.createServer(app);
server.listen(Port,() => {
    console.log(`Server is running on port ${Port}`);
})

//MIDDLEWARE ----------------------------------------------------------------------------
// when we set credentials: true or any custom header this thing is important 
app.options('http://localhost:5173', cors()); // for handling preflight requests when your frontend (React) makes a request to the backend, and the browser automatically sends a preflight request before the actual request.
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true //allow front end to send cookies and receive cookies from the backend
}))
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/Uploads', express.static('Uploads')); // express.static tells server that uploads folder contain static files like images, videos, etc. and we can access them using /Uploads/filename.jpg 1st part is /Uploads URl 2nd part is folder name



//ROUTES --------------------------------------------------------------------------------
app.use('/users', UserRouter);
app.use('/property', PropertyRouter);
