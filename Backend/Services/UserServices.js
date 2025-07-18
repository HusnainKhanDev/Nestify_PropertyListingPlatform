const {sql, poolPromise} = require('../DB')

async function CreateUser(Name, Email, Password, Phone){
    if(!Name || !Email || !Phone || !Password){
        throw new Error('All fields are required');
    }

    try{
        const pool = await poolPromise;
        let result = await pool.request() //This creates a new SQL request using the connection from the pool.
                .input("Name", sql.VarChar(50), Name)
                .input("Email", sql.VarChar(100), Email) // the last parameter is actual data 
                .input("Password", sql.VarChar(255), Password)
                .input("Phone", sql.VarChar(15), Phone)
                .query(`INSERT INTO Users (Name, Email, Password, Phone) OUTPUT INSERTED.* VALUES (@Name, @Email, @Password, @Phone)`);
                //@Name, @Email, @Password, @Phone match the parameter names defined in .input().
                
        return result;
    }
    catch(err){
        console.log(err);
        const msg = err?.originalError?.info?.message || "";
        
        //.includes sheck the substring in the provided string
        if (msg.includes('Email_UQ')) {
            const error = new Error('Email already exists');
            error.status = 400;
            throw error;
        } else if (msg.includes('Phone_UQ')) {
            const error = new Error('Phone number already exists');
            error.status = 400;
            throw error;
        }

        // Other DB error
        const error = new Error('Database error during user creation');
        error.status = 500;
        throw error;
    }
};


async function login(Email, Password){

    try{
        let pool = await poolPromise;
        let result = await pool.request()
        .input("Email", sql.VarChar(50), Email)
        .input("Password", sql.VarChar(255), Password)
        .query(`SELECT * FROM Users WHERE Email = @Email`);

        return result;
    }
    catch(err){
        console.log(err);
        throw new Error('Error logging in');
    }

}

async function getUserByID(UserID){
    try{
        let Pool = await poolPromise;
        let result = await Pool.request()
        .input("UserID", sql.Int, UserID)
        .query(`SELECT * FROM Users WHERE UserID = @UserID`);

        return result;
    }
    catch(err){
        console.log(err);
        throw new Error('Error getting user by ID');
    }
}





module.exports = {
    CreateUser: CreateUser,
    login: login,
    getUserByID: getUserByID
}