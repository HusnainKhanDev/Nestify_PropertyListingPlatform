const { validationResult } = require("express-validator")
const PropertyServices = require('../Services/PropertyServices')



async function CreateNewProperty(req, res){
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array().map(err => err.msg)});
    }

    const { Address, Purpose, City, Type, Area, Description, Amount, UserID} = req.body
    

    const files = req.files;// this method attached by multer

    const MainImage = files?.MainImage?.[0]?.filename || null; //filename is the name multer gave to the file on disk 
    const SubImage1 = files?.SubImage1?.[0]?.filename || null; //explanation is in the end of this file
    const SubImage2 = files?.SubImage2?.[0]?.filename || null;
    
    try{
        const NewProperty = await PropertyServices.CreateProperty({Address, Purpose, City, Type, Area, Description, Amount, UserID}, MainImage, SubImage1, SubImage2)

        if(NewProperty){
            return res.status(200).json({ msg: 'Property created successfully'})
        }
        else{
            return res.status(400).json({ msg: 'Error creating property images'})
        }
    }
    catch(err){
        console.log('reate Propert Error',err)
        return res.status(500).json({ msg: 'Error creating property', error: err.message})
    }
     
}

async function GetProperties(req, res) {
    try{
        const AllProperties = await PropertyServices.FetchProperties()

        if(AllProperties.rowsAffected[0] > 0){
            res.status(200).json({msg: "Fetched Successfully", AllProperties})
        }
    }
    catch(err){
        console.log(err)
        res.status(400).json({msg: "Error while getting Properties", error: err.message})
    }
}

async function UserListings(req, res){
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array().map(err => err.msg)});
    }

    try{
        const UserID = req.query.ID
        const result = await PropertyServices.GetPropertiesByUserid(UserID)

        if(result.rowsAffected[0] > 0){
            res.status(200).json({msg: "Property Found", Result: result.recordset})
        }
        else{
            res.status(404).json({msg: "Properties Not Found"})
        }
    }
    catch(err){
        console.log(err)
        res.status(500).json({msg: "Internal Server Error", Error: err.message})
    }
}

async function DeleteProperty(req, res){
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array().map(err => err.msg)});
    }

    const Pid = req.query.Propertyid
    console.log("Prop ID from Delete controller: " , Pid)
    try{
        let result = await PropertyServices.RemoveProperty(Pid)
        if(result.rowsAffected[0] > 0){
            res.status(200).json({msg: "Property Is Deleted"})
        }
    }
    catch(err){
        res.status(500).json({msg: "Internal Server Error", Error: err.message})
    }
}

async function UpdateProperty(req, res){
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array().map(err => err.msg)});
    }

    const { Address, Purpose, City, Type, Area, Description, Amount, PropertyID} = req.body
    try{
        const result = await PropertyServices.UpdateProperty({ Address, Purpose, City, Type, Area, Description, Amount, PropertyID})

        if(result.rowsAffected[0] > 0){
            res.status(200).json({msg: "Property Updated Successfuly"})
        }
    }
    catch(err){
        res.status(500).json({msg: "Error! Property Not Updated", Error: err.message})
    }
}

async function GetFilteredData(req, res){
    if (Object.keys(req.query).length === 0) {
        return res.status(400).json({msg: "No filters provided in query"});
    }

    const values = {};
    
    if (req.query.City) values.City = req.query.City;
    if (req.query.Amount) values.Amount = req.query.Amount;
    if (req.query.Purpose) values.Purpose = req.query.Purpose;
    if (req.query.Area) values.Area = req.query.Area;
    if (req.query.Type) values.Type = req.query.Type;

    try{
        const result = await PropertyServices.FilterProperty(values)
        if(result.rowsAffected[0] > 0){
            res.status(200).json({msg: "Successfully Filtered", result})
        }
        else{
            res.status(400).json({msg: "No Such Property Exist"})
        }
    }
    catch(err){
        console.log(err)
        res.status(500).json({msg: "Something went Wrong: ", error: err.message})
    }
}

async function Analytics(req, res){

    const UserID = req.query.userID;
    if(!UserID){
        res.status(400).json({msg: "User ID is Missing"})
    }

    try{
        const result = await PropertyServices.GetAnalytics(UserID)

        if(result.rowsAffected[0] > 0){
            res.status(200).json({msg: "All Queries Executed", result})
        }
    }
    catch(err){
        console.log(err)
        res.status(500).json({msg: "Something went Wrong while Running Queries", error: err.message})
    }


}

async function AddTOFavorites(req, res){
    const {Uid, Pid} = req.body

    if (!Uid || !Pid) {
       return res.status(400).json({msg: "User and Property ID is Required"})
    }
    try{
        let response = await PropertyServices.favoriteService(Uid, Pid)
        if(response.rowsAffected[0] > 0){
            res.status(201).json({msg: "You Liked this Post"})
        }
        else{
            res.status(503).json({msg: "Something Went Wrong in Favorites"})
        }
    }
    catch (err) {
        res.status(500).json({msg: "Server Not Responding"})
    }

}

async function getUserFavorites (req, res) {
    try {
        const userId = req.query.userid;

        if (!userId) {
            return res.status(400).json({ message: "UserID is required in query" });
        }

        const favorites = await PropertyServices.fetchUserFavorites(userId);

        return res.status(200).json({ favorites });
    } catch (error) {
        console.error("Error fetching user favorites:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

async function deleteFavProperty(req, res){
    const {Uid, Pid} = req.query
    console.log(Uid, Pid)

    if (!Uid || !Pid) {
       return res.status(400).json({msg: "User and Property ID is Required"})
    }

    try{
        
        let response = await PropertyServices.DeleteService(Uid, Pid)
        if(response.rowsAffected[0] > 0){
            res.status(200).json({msg: "You DisLiked this Post"})
        }
        else{
            res.status(503).json({msg: "Something Went Wrong in Favorites"})
        }
    }
    catch (err) {
        res.status(500).json({msg: "Server Not Responding"})
    }
}

async function FindNearByProperties(req, res){
    const {ltd, lng} = req.query
    if(!ltd || !lng){
        return res.status(400).json({msg: "User Location is Required"})
    }
    try{
        let response = await PropertyServices.Nearby({ltd, lng})

        if (response.rowsAffected[0] > 0) {
            res.status(200).json({msg: "Got Nearby Location Successfully", Nearby: response})
        }
    }
    catch(err){
        res.status(500).json({msg: "Crashed while finding Nearby", error: err.message})
    }
}


module.exports = {
    CreateNewProperty: CreateNewProperty,
    GetProperties: GetProperties,
    UserListings:UserListings,
    DeleteProperty: DeleteProperty,
    UpdateProperty: UpdateProperty,
    GetFilteredData: GetFilteredData,
    Analytics: Analytics,
    AddTOFavorites: AddTOFavorites,
    getUserFavorites: getUserFavorites,
    deleteFavProperty: deleteFavProperty,
    FindNearByProperties: FindNearByProperties
}






// Uploads.fileds pack the image metadata like this thats why using [0] to get the first object in the array

// req.files = {
//     MainImage: [ { filename: 'main123.jpg', ... } ],      // Array with 1 object
//     SubImage1: [ { filename: 'sub1.jpg', ... } ],         // Array with 1 object
//     SubImage2: [ { filename: 'sub2.jpg', ... } ]          // Array with 1 object
//   }