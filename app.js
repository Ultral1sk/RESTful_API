const express    = require('express');
const app        = express();
const morgan     = require('morgan');
const bodyParser = require('body-parser')

const productRoutes = require('./api/routes/products');
const orderRoutes   = require('./api/routes/orders');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());

// apply a new middleware to every RESPONSE that is going to happen on this server
app.use(( req, res, next ) => {
    res.header('Acces-Control-Allow-Origin', '*');  // By default this is not allowed
    res.header('Acces-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

// with this condition we are setting an option which checks if the browser is allowed to do this kind of reqeusts
    if( req.method === 'OPTIONS') {
        res.header('Acces-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

// Routes which should handle request
app.use('/products', productRoutes);
app.use('/orders'  , orderRoutes);

// we want acces every request that  reaches / line
app.use(( req, res, next ) => {         
    const error = new Error('Not found');
    error.status = 404  ;       // custom 404 handler
    next(error); 
});

app.use((error, req, res, next) => { // other kinds of errors
    res.status(error.status || 500);
    res.json({
        error : {
            message : error.message
        }
    });
});

module.exports = app;