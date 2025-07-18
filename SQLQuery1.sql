
CREATE TABLE Users(
UserID int IDENTITY(1,1) constraint UserID_PK  primary key,
Name varchar(50) NOT NULL,
Email varchar(100)  constraint Email_UQ UNIQUE ,
Password varchar(max) NOT NULL,
Phone VARCHAR(15) CONSTRAINT Phone_CK CHECK (Phone LIKE '[0-9]%')
);

select * from users;
delete from users;
alter table Users add constraint Phone_UQ unique(Phone)


CREATE TABLE Images (
ImageID int identity(1,1) constraint ImageID_PK primary key,
MainImage varchar(100) Not Null,
SubImage1 varchar(100),
SubImage2 varchar(100),
)

alter table Images add PropertyID int , constraint PID_FK foreign key(PropertyID) references Properties(PropertyID) ON delete cascade
select * from Images
alter table Images drop constraint PID_FK
alter table Images drop column PropertID



CREATE TABLE Properties(
PropertyID int identity(1,1) constraint PropertyID_PK primary key,
Address varchar(100) constraint Address_UQ unique not null,
Purpose varchar(10) not null constraint chk_purpose check (Purpose in ('Sale', 'Rent')), -- rent or sell 
--Total number is 9 and decimal point are 6 
Ltd decimal(9,6),
Lng decimal(9,6),
City varchar(50),
Area varchar(50) not null, --Size is Sqft
Description varchar(500),
Amount money not null,
CreatedAt datetime,
ProUserID int, 
constraint PUserID_FK foreign key (ProUserID) references Users(UserID) ON delete cascade,
);

alter table Properties drop constraint chk_purpose
alter table Properties add Type varchar(30) not null 
ALTER TABLE Properties ADD CONSTRAINT chk_purpose CHECK (Purpose IN ('Sale', 'Rent'));
alter table Properties add FavoriteCount INT default 0;
ALTER TABLE Properties DROP CONSTRAINT DF__Propertie__Favor__607251E5
alter table Properties drop column FavoriteCount
alter table Properties drop constraint PUserID_FK
alter table Properties drop column ProUserID
select *  from Properties
delete from Properties where PropertyID = 5

update Properties set Area = '120' where Area = 'Malir'

SELECT City, COUNT(PropertyID) AS PropertyCount FROM Properties WHERE ProUserID = 12 GROUP BY City
SELECT Purpose, COUNT(*) AS TotalListings FROM Properties where ProUserID = 12 GROUP BY Purpose;
SELECT COUNT(PropertyID) from Properties where ProUserID = 22
SELECT Purpose, MAX(Amount) as 'Heighest Price Property' from Properties where ProUserID =12 group by Purpose
SELECT City,Purpose, AVG(Amount) AS AvgPrice FROM  Properties where ProUserID = 12 GROUP BY City, Purpose;

CREATE TABLE Favorites(
User_ID int, constraint UId_FK foreign key(User_ID) references Users(UserID) ON delete cascade,
Property_ID int, constraint ProId_FK foreign key(Property_ID) references Properties(PropertyID),
CreatedAt DATETIME DEFAULT GETDATE()
constraint Comp_Fav_PK primary key(User_ID, Property_ID)
)

SELECT * FROM Favorites
delete from Favorites

CREATE TRIGGER trg_UpdateFavoriteCount
ON Favorites AFTER INSERT, DELETE --run the trigger after these operations
AS
BEGIN
    -- This will recalculate and update the favorite count in Properties table
    UPDATE Properties
    SET FavoriteCount = (
        SELECT COUNT(*)
        FROM Favorites
        WHERE Properties.PropertyID = Favorites.Property_ID
    )
	--Inserted and deleted are virtual tables which contain rows from favirote table affected by insert and delete command
	--So it only count those rows which are present in inserted deleted
	--this part executes first 
    WHERE PropertyID IN (
        SELECT Property_ID FROM inserted -- get id from here when inserted in favorite
        UNION
        SELECT Property_ID FROM deleted -- get id from here when deleted from  favorite
    )
END

CREATE PROCEDURE GetNearbyProperties
    @UserLat FLOAT,
    @UserLng FLOAT
AS
BEGIN
    SELECT 
        p.PropertyID, p.Type, p.FavoriteCount, p.Address, p.Purpose,
        p.Ltd, p.Lng, p.City, p.Area, p.Description, p.Amount, p.CreatedAt,
        i.MainImage, i.SubImage1, i.SubImage2,
        u.Name, u.Email, u.Phone,

        -- Calculate distance in KM using Haversine Formula
        6371 * ACOS(
            COS(RADIANS(@UserLat)) * COS(RADIANS(p.Ltd)) *
            COS(RADIANS(p.Lng) - RADIANS(@UserLng)) +
            SIN(RADIANS(@UserLat)) * SIN(RADIANS(p.Ltd))
        ) AS DistanceInKm

    FROM Properties p
    INNER JOIN Images i ON p.PropertyID = i.PropertyID
    INNER JOIN Users u ON u.UserID = p.ProUserID

    WHERE 
        6371 * ACOS(
            COS(RADIANS(@UserLat)) * COS(RADIANS(p.Ltd)) *
            COS(RADIANS(p.Lng) - RADIANS(@UserLng)) +
            SIN(RADIANS(@UserLat)) * SIN(RADIANS(p.Ltd))
        ) <= 5

    ORDER BY DistanceInKm;
END;

exec GetNearbyProperties @UserLat = 24.8917, @UserLng =67.2066
