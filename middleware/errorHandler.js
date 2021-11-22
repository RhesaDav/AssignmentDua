module.exports = (err, res, next) => {
    let code = 0;
    let name = err.name;
    let message = '';

    switch (name) {
        case 'NOT_FOUND' :
            code = 404;
            message = 'data_not_found';
            break;
        case 'UNAUTHORIZED' :
            code = 401;
            message = 'prohibit1ed';
            break;
        default :
            code = 500
            message = 'Internal Server Error'
            break
    }
    res.status(code).json({message: message})
}