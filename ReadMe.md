# Nestify - Property Deal Platform

Nestify is a full-stack web application for property listing, searching, and management. It allows users to sign up, log in, post properties for sale or rent, view analytics, filter/search listings, manage favorites, and see nearby properties using geolocation.

---

## 🛠️ Tech Stack

**Frontend:**  
- React (with hooks and context)
- Tailwind CSS
- Material UI
- Framer Motion (animations)
- Axios (API calls)
- React Router
- React Toastify (notifications)
- Leaflet & React-Leaflet (maps)
- Remixicon (icons)
- GSAP (animations)
- Slick Carousel (image slider)

**Backend:**  
- Node.js
- Express.js
- MSSQL (SQL Server)
- Multer (file uploads)
- JWT (authentication)
- bcrypt (password hashing)
- dotenv (env config)
- express-validator (validation)
- cookie-parser
- CORS

---

## 📦 Features

- **User Authentication:** Signup, login, JWT-based session, protected routes.
- **Property Listings:** Post, update, delete, and view properties.
- **Image Uploads:** Upload main and sub images for each property.
- **Favorites:** Like/dislike properties, view favorite list.
- **Filtering:** Filter properties by city, area, price, type, and purpose.
- **Analytics:** View city-wise count, purpose-wise count, total listings, highest price, and average price.
- **Nearby Properties:** Find properties within 5km using Haversine formula and geolocation.
- **Map Integration:** View property location on map.
- **Responsive UI:** Modern, animated, and mobile-friendly interface.

## 🗄️ Database Structure

- **Users:** UserID, Name, Email, Password, Phone
- **Properties:** PropertyID, Address, Purpose, Type, Ltd, Lng, City, Area, Description, Amount, CreatedAt, ProUserID, FavoriteCount
- **Images:** ImageID, PropertyID, MainImage, SubImage1, SubImage2
- **Favorites:** User_ID, Property_ID, CreatedAt

---

## 📚 API Endpoints

### **User Endpoints**
- `POST /users/signup`  
  Signup new user  
  **Body:** Name, Email, Password, Phone

- `POST /users/login`  
  Login user  
  **Body:** Email, Password

- `GET /users/get/profile`  
  Get user profile (protected, needs JWT cookie)

---

### **Property Endpoints**
- `POST /property/create/listing`  
  Create new property listing (multipart/form-data for images)  
  **Body:** Address, Purpose, City, Type, Area, Description, Amount, UserID, MainImage, SubImage1, SubImage2

- `GET /property/fetch/all`  
  Fetch all properties

- `GET /property/get/user/listings?ID={UserID}`  
  Get properties listed by a user

- `DELETE /property/delete/by-PropertID?Propertyid={PropertyID}`  
  Delete property by ID

- `PATCH /property/update`  
  Update property details  
  **Body:** Address, Purpose, City, Type, Area, Description, Amount, PropertyID

- `GET /property/get/filter/items?Amount=&Purpose=&Area=&City=&Type=`  
  Filter properties by query params

- `GET /property/get/Analytics?userID={UserID}`  
  Get analytics for user's listings

- `GET /property/nearby-properties?ltd={lat}&lng={lng}`  
  Get properties within 5km of user location

---

### **Favorites Endpoints**
- `POST /property/add/to/favorites`  
  Add property to favorites  
  **Body:** Uid, Pid

- `GET /property/get/favProperties/byUser-ID?userid={UserID}`  
  Get user's favorite properties

- `DELETE /property/delete/fav-Property?Uid={UserID}&Pid={PropertyID}`  
  Remove property from favorites

---

## 🖼️ Image Uploads

- Images are uploaded via Multer and stored in `/Backend/Uploads/`.
- Access images via: `http://localhost:5000/Uploads/{filename}`

---

## 🔒 Authentication

- JWT tokens are set in cookies on login/signup.
- Protected routes check for valid JWT in cookies.

---

## 📊 Analytics

- City-wise property count
- Purpose-wise listing count
- Total listings
- Highest price per purpose
- Average price by city and purpose

---

## 🌍 Nearby Properties

- Uses browser geolocation and Haversine formula in SQL to find properties within 5km.

---

## 📂 Folder Structure

```
Backend/
  Controller/
  MiddleWare/
  Routers/
  Services/
  Uploads/
  DB.js
  Server.js
  .env
FrontEnd/
  src/
    Components/
    Context/
    Pages/
  index.html
  package.json
  tailwind.config.js
  vite.config.js
```