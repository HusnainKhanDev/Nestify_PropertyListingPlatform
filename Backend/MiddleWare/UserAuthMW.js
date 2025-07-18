const jwt = require('jsonwebtoken');


function CheckUserAuth(req, res, next) {
    const token = req.cookies.token 
    if (!token) {
        return res.status(401).json({ msg: 'Unauthorized! token Not Found' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the user information to the request object
        next(); // Call the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ msg: 'Unauthorized! Invalid token' });
    }
}

module.exports = {
    CheckUserAuth: CheckUserAuth
}