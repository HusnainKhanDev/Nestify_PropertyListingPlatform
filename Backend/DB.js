const sql = require('mssql');

const DBconfig = {
    server: "localhost",
    database: "Nestify",
    user: "HusnainAdmin",  // Your new SQL username
    password: "Admin123",  // Your SQL password
    options: {
        encrypt: false,
        trustServerCertificate: true,
        multiple: true,
    }
};
// ConnectionPool create a pool and .connect connects that pool with DB
const poolPromise = new sql.ConnectionPool(DBconfig).connect()
.then(pool => {
    console.log("Connected to SQL Server...");
    return pool; 
})
.catch(err => {
    console.error("Database connection failed:", err);
});


module.exports = { sql, poolPromise };

// new sql.ConnectionPool(dbConfig).connect() tries to create a connection pool. and connect it
// Since .connect() is asynchronous, it returns a Promise.
// .then((pool) => { return pool }) → Once connected, we store the pool in poolPromise.