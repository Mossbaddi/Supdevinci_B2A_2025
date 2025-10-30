const AppError = require('../utils/AppError')


function handleValidationError(err) {
    const errors = Object.values(err.errors).map(err => err.message);

    const message = `Données Invalides: ${errors.join('. ')}`

    return new AppError(message, 400)

}


function handleDuplicateFieldsError(err) {
    const value = err.errmsg.match(/(["'}])(\\?.)*?\1/)[0];

    const message = `la valeur ${value} existe déja. Veuillez utiliser une autre valeur`
    return new AppError(message, 400)
}


function handleCastError(err) {
    const message = `${err.path} invalide : ${err.value}`
    return new AppError(message, 400)

}






function sendErrorDev(err, res) {
    res.status(err.statusCode).json({
        success: false,
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
        details: err.errors || null
    })
}

function sendErrorProd(err, res) {
    res.status(err.statusCode).json({
        success: false,
        status: 'error',
        message: 'Une erreur est survenue. réessayez plus tard.'
    })
}

function errorHandler(err, req, res, next) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';


    // environnement de dev
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res)
    }
    //  Environnement de production
    else {
        let error = {...error};
        error.message = err.message
        error.name = err.name



        if (error.name === 'CastError') {
            error = handleCastError(error);
        }

        if (error.code === 11000) {
            error = handleDuplicateFieldsError(error)
        }


        if (error.name ==='ValidationError') {
            error = handleValidationError(error)
        }

        sendErrorProd(error, res);
    }
}

function notFound(req, res, next) {
    const message = `Route non trouvée : ${req.method} ${req.originalUrl}`;
    next(new AppError(message, 404))
}

function catchAsync(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}


module.exports = {
    errorHandler,
    notFound,
    catchAsync
}