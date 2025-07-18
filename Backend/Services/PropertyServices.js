const { default: axios } = require('axios');
const { sql, poolPromise } = require('../DB')


async function Getlocation(Address) {

    const encodedAddress = encodeURIComponent(Address);
    const url = `https://maps.gomaps.pro/maps/api/geocode/json?key=${process.env.APIKEY}&address=${encodedAddress}`;
    const response = await axios.get(url);

    if (response.status === 200) {

        const location = response.data.results[0].geometry.location;
        return { ltd: location.lat, lng: location.lng };
    }
    else {
        throw new Error('Error fetching location');
    }
}

async function CreateProperty(Details, MainImage, SubImage1, SubImage2) {
    const { Address, Purpose, City, Type, Area, Description, Amount, UserID } = Details;

    if (!Address || !Purpose || !City || !Type || !Area || !Description || !Amount || !UserID) {
        throw new Error('All fields are required');
    }
    const date = new Date().toISOString();

    const { ltd, lng } = await Getlocation(Address);
    if (!ltd || !lng) {
        throw new Error('Error fetching location coordinates');
    }
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();
        // we use transaction.request() instead of pool.request() to make queries inside the transaction.
        const request = transaction.request(); //  Use transaction's request

        // Insert into Properties
        const result = await request
            .input("Address", sql.VarChar(255), Address)
            .input("Purpose", sql.VarChar(50), Purpose)
            .input("Ltd", sql.Decimal(9, 6), ltd)
            .input("Lng", sql.Decimal(9, 6), lng)
            .input("City", sql.VarChar(50), City)
            .input("Type", sql.VarChar(30), Type)
            .input("Area", sql.VarChar(50), Area)
            .input("Description", sql.VarChar(255), Description)
            .input("Amount", sql.Money, Amount)
            .input("Date", sql.DateTime, date)
            .input("ProUserID", sql.Int, UserID)
            .query(`
                INSERT INTO Properties 
                (Address, Purpose, Ltd, Lng, City, Type, Area, Description, Amount, CreatedAt, ProUserID) 
                OUTPUT INSERTED.PropertyID
                VALUES (@Address, @Purpose, @Ltd, @Lng, @City, @Type, @Area, @Description, @Amount, @Date, @ProUserID)`);

        if (result.rowsAffected[0] <= 0) {
            await transaction.rollback();
            throw new Error('Failed to insert property');
        }

        const ID = result.recordset[0].PropertyID;

        // Insert into Images
        const result2 = await request
            .input("PropertyID", sql.Int, ID)
            .input("MainImage", sql.VarChar(255), MainImage)
            .input("SubImage1", sql.VarChar(255), SubImage1)
            .input("SubImage2", sql.VarChar(255), SubImage2)
            .query(`
                INSERT INTO Images (PropertyID, MainImage, SubImage1, SubImage2) 
                OUTPUT INSERTED.* 
                VALUES (@PropertyID, @MainImage, @SubImage1, @SubImage2)`);

        if (result2.rowsAffected[0] > 0) {
            await transaction.commit();
            return true;
        } else {
            await transaction.rollback();
            throw new Error('Failed to insert property images');
        }
    } catch (err) {
        await transaction.rollback();
        console.log('Duplicate Address Error',err.number);
        throw new Error('Error creating property');
    }
}


async function FetchProperties() {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                SELECT 
                    p.PropertyID, p.Type, p.FavoriteCount, p.Address, p.Purpose, p.Ltd, p.Lng, p.City, p.Area, p.Description, p.Amount, p.CreatedAt,
                    i.MainImage, i.SubImage1, i.SubImage2,
                    u.Name, u.Email, u.Phone
                FROM Properties p 
                INNER JOIN Images i ON p.PropertyID = i.PropertyID
                INNER JOIN Users u ON u.UserID = p.ProUserID
            `);
        return result;
    } catch (err) {
        console.log(err);
        throw new Error("Error while fetching properties");
    }
}

async function GetPropertiesByUserid(ID) {

    try {
        const pool = await poolPromise;
        let result = await pool.request()
            .input("UID", sql.Int, ID)
            .query(`SELECT * FROM Properties WHERE ProUserID = @UID`)

        return result
    }
    catch (err) {
        console.log(err)
        throw new Error("Error While Fetching Properties By ID")
    }

}

async function RemoveProperty(Pid) {

    try {
        let pool = await poolPromise;
        let result = await pool.request()
            .input("PID", sql.Int, Pid)
            .query(`DELETE FROM Properties where PropertyID = @PID`)

        return result
    }
    catch (err) {
        console.log(err)
        throw new Error("Error While Deleting Propert")
    }

}

async function UpdateProperty(params) {
    const { Address, Purpose, City, Type, Area, Description, Amount, PropertyID } = params;

    const { ltd, lng } = await Getlocation(Address);
    if (!ltd || !lng) {
        throw new Error('Error fetching location coordinates');
    }

    const date = new Date().toISOString();
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .input("Address", sql.VarChar(255), Address)
            .input("Purpose", sql.VarChar(50), Purpose)
            .input("Ltd", sql.Decimal(9, 6), ltd)
            .input("Lng", sql.Decimal(9, 6), lng)
            .input("City", sql.VarChar(50), City)
            .input("Type", sql.VarChar(30), Type)
            .input("area", sql.VarChar(50), Area)
            .input("Description", sql.VarChar(255), Description)
            .input("Amount", sql.Money, Amount)
            .input("Date", sql.DateTime, date)
            .input("Propertyid", sql.Int, PropertyID)
            .query(`UPDATE Properties 
                SET 
                    Address = @Address,
                    Purpose = @Purpose,
                    Ltd = @Ltd,
                    Lng = @Lng,
                    City = @City,
                    Type = @Type,
                    Area = @area,
                    Description = @Description,
                    Amount = @Amount,
                    CreatedAt = @Date
                WHERE 
                    PropertyID = @Propertyid`
            )
        return result;
    }
    catch (err) {
        console.log(err)
        throw new Error("Some thing went wrong while Updating the table")
    }

}

async function FilterProperty(values) {
    // Step 1: Build WHERE conditions based on filters
    let conditions = Object.keys(values).map((key) => {
        if (key == 'Amount' || key == 'Area') {
            return `${key} < @${key}`;
        }
        return `${key} = @${key}`;
    }).join(' AND ');

    console.log(conditions)
    // Step 2: Build the SQL query using placeholders like @City, @Price, etc.
    let query = `SELECT 
                p.Address, p.Type, p.FavoriteCount, p.Purpose, p.Ltd, p.Lng, p.City, p.Area, p.Description, p.Amount, p.CreatedAt,
                i.MainImage, i.SubImage1, i.SubImage2,
                u.Name, u.Email, u.Phone
            FROM Properties p 
            INNER JOIN Images i ON p.PropertyID = i.PropertyID
            INNER JOIN Users u ON p.ProUserID = u.UserID
            WHERE ${conditions} `;
            
    // Step 3: Create connection and request
    let pool = await poolPromise
    let request = pool.request();
    
    // Step 4: Bind values to parameters using request.input
    Object.keys(values).forEach(key => {
        request.input(key, values[key]);
    });
    try{
        // Step 5: Now run the query; placeholders will be automatically filled
        let result = await request.query(query);
        return result;
    }
    catch(err){
        throw new Error("Error while Filtring Data")
    }
}

async function GetAnalytics(ID) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('UserID', sql.Int, ID)
            .query(
                `SELECT City, COUNT(PropertyID) AS PropertyCount FROM Properties WHERE ProUserID = @UserID GROUP BY City;
                SELECT Purpose, COUNT(*) AS TotalListings FROM Properties where ProUserID = @UserID GROUP BY Purpose;
                SELECT COUNT(PropertyID) as 'Total Listings' from Properties where ProUserID = @UserID;
                SELECT Purpose, MAX(Amount) as 'Heighest Price Property' from Properties where ProUserID = @UserID group by Purpose;
                SELECT City,Purpose, AVG(Amount) AS AvgPrice FROM  Properties where ProUserID = @UserID GROUP BY City, Purpose;
                `
            )

            return result;
    }
    catch(err){
        console.log(err)
        throw new Error("Error While Running Qureies")
    }
}

async function favoriteService(Uid, Pid){
    try{
        let pool = await poolPromise
        let result = await pool.request()
        .input("U_ID", sql.Int, Uid)
        .input("P_ID", sql.Int, Pid)
        .query(`INSERT INTO Favorites(User_ID, Property_ID) VALUES(@U_ID, @P_ID) `)

        return result;
    }
    catch(err){
        console.log(err)
        throw new Error("Error While Inserting Into Favorites")
    }
}

const fetchUserFavorites = async (userId) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('UserID', sql.Int, userId)
        .query(`
            SELECT Property_ID FROM Favorites  WHERE User_ID = @UserID `);

    return result;
};

async function DeleteService(Uid, Pid){
    try{
        let pool = await poolPromise
        let result = await pool.request()
        .input("U_ID", sql.Int, Uid)
        .input("P_ID", sql.Int, Pid)
        .query(`DELETE FROM Favorites WHERE User_ID = @U_ID AND Property_ID = @P_ID `)
        return result;
    }
    catch(err){
        console.log(err)
        throw new Error("Error While Deleting Property from Favorites")
    }
}

async function Nearby({ltd, lng}) {
    try{
        let pool = await poolPromise
        let result = await pool.request()
            .input("UserLat", sql.Decimal(9, 6), ltd)
            .input("UserLng", sql.Decimal(9, 6), lng)
            .execute('GetNearbyProperties')

        return result
    }
    catch(err){
        throw new Error("Error while Finding near by location")
    }
}

module.exports = {
    CreateProperty: CreateProperty,
    FetchProperties: FetchProperties,
    GetPropertiesByUserid: GetPropertiesByUserid,
    RemoveProperty: RemoveProperty,
    UpdateProperty: UpdateProperty,
    FilterProperty: FilterProperty,
    GetAnalytics: GetAnalytics,
    favoriteService: favoriteService,
    fetchUserFavorites: fetchUserFavorites,
    DeleteService: DeleteService,
    Nearby: Nearby
}