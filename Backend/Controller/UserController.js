const { validationResult } = require("express-validator")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserServices = require('../Services/UserServices')


async function Signup(req, res){
    
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array().map(err => err.msg)});
    }

    const {Name, Email, Password, Phone} = req.body
    let BPassword = await bcrypt.hash(Password, 8);

    try {
        let result = await UserServices.CreateUser(Name, Email, BPassword, Phone)

        if(result.rowsAffected[0] > 0){
            console.log('User created successfully')
            const token = jwt.sign({ ID: result.recordset[0].UserID, Name: result.recordset[0].Name }, process.env.JWT_SECRET, { expiresIn: '7d' });
            
            res.cookie("token", token, {
                httpOnly: false,  // Prevents client-side JS access
                secure: false,   // Set `true` in production with HTTPS
                sameSite: "lax", // Use "none" if frontend & backend have different origins
              });
            return res.status(200).json({ msg: 'User created successfully', result, token: token});
        }

    } catch (error) {
        console.error('Signup Error:', error.message);
        const status = error.status || 500;
        res.status(status).json({ msg: error.message });
    }
}


async function Login(req, res){

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array().map(err => err.msg)});
    }

    const { Email, Password } = req.body;

    if(!Email || !Password){
        return res.status(400).json({ msg: "Email and Password are required"})
    }

    try{
        let user = await UserServices.login(Email)
        
        if(user.rowsAffected[0] > 0){
            let match = await bcrypt.compare(Password, user.recordset[0].Password)
            if(match){
                const token = jwt.sign({ ID: user.recordset[0].UserID, Name: user.recordset[0].Name }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
                res.cookie("token", token, {
                    httpOnly: false,  // Prevents client-side JS access
                    secure: false,   // Set `true` in production with HTTPS
                    sameSite: "Lax", // Use "none" if frontend & backend have different origins in production use lax for development
                  });
                return res.status(200).json({ msg: 'Login successful', user, token: token});
            }
            else{
                return res.status(401).json({ msg: 'Invalid credentials' })
            }
        }
        else{
            return res.status(401).json({ msg: 'Invalid Email' })
        }
    }
    catch(error){
        console.error(error)
        return res.status(401).json({ msg: 'Invalid credentials' })
    }

}


async function GetProfile(req, res){
    const UserID = req.user.ID

    try{
        let result = await UserServices.getUserByID(UserID)
        if(result.recordset[0]){
            return res.status(200).json({ msg: 'User found', result})
        }
        else{
            return res.status(404).json({ msg: 'User not found' })
        }
    }
    catch(error){
        console.error(error)
        return res.status(500).json({ msg: 'Server error' })
    }
    
}


module.exports = {
    Signup: Signup,
    Login: Login,
    GetProfile: GetProfile
}