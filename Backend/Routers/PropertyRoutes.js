const express = require('express');
const { body, query } = require('express-validator');
const PropertyController = require('../Controller/PropertyController')
const route = express.Router();


const path = require('path')
const multer = require('multer')

//Config Multer
const storage = multer.diskStorage({ //diskStorage is used to store the file in the server disk or in folder
    destination: function (req, file, cb) { //put files in uploads folder
        cb(null, 'Uploads')
    },
    filename: function (req, file, cb) { //save the changed file name 
        cb(null, Date.now() + path.extname(file.originalname))//path.extname gives the extension of the file
    }
})
// it is a built-in way in multer to create middleware that handles file uploads for Express routes.
const upload = multer({ storage: storage })

//this tell multer to upload multiple files with different names
// It reads the uploaded files from the incoming form fields with names:
//Attaches File Metadata to req.files
const multiUploads = upload.fields([
    { name: 'MainImage', maxCount: 1 },
    { name: 'SubImage1', maxCount: 1 },
    { name: 'SubImage2', maxCount: 1 },
])



route.post("/create/listing", multiUploads, // this is the middleware for uploading multiple files and attach file method to request
    [
        body('Address').notEmpty().withMessage('Address is required'),
        body('Purpose').notEmpty().withMessage('Purpose is required'),
        body('City').notEmpty().withMessage('City is required'),
        body('Area').notEmpty().withMessage('Area is required'),
        body('Type').notEmpty().withMessage('Type is required'),
        body('Description').notEmpty().withMessage('Description is required'),
        body('Amount').notEmpty().withMessage('Price is required'),
        body('UserID').notEmpty().withMessage('UserID is required'),
    ],
    PropertyController.CreateNewProperty
)

route.get("/fetch/all", PropertyController.GetProperties)

route.get('/get/user/listings', [query('ID').notEmpty().withMessage("User ID is required")], PropertyController.UserListings)


route.delete("/delete/by-PropertID", [query('Propertyid').notEmpty().withMessage("Propert ID is required")], PropertyController.DeleteProperty)

route.patch("/update",
    [
        body('Address').notEmpty().withMessage('Address is required'),
        body('Purpose').notEmpty().withMessage('Purpose is required'),
        body('City').notEmpty().withMessage('City is required'),
        body('Type').notEmpty().withMessage('Type is required'),
        body('Area').notEmpty().isString().withMessage('Area is required'),
        body('Description').notEmpty().withMessage('Description is required'),
        body('Amount').notEmpty().withMessage('Price is required'),
        body('PropertyID').notEmpty().withMessage('PropertyID is required'),
    ],
    PropertyController.UpdateProperty
)

route.get('/get/filter/items', PropertyController.GetFilteredData)

route.get('/get/Analytics', PropertyController.Analytics)

route.post('/add/to/favorites', PropertyController.AddTOFavorites)

route.get("/get/favProperties/byUser-ID", PropertyController.getUserFavorites)

route.delete("/delete/fav-Property", PropertyController.deleteFavProperty)

route.get('/nearby-properties', PropertyController.FindNearByProperties)

module.exports = route;