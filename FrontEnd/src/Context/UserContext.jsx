import React, { createContext, useEffect, useState } from 'react'

export const UserDataContext = createContext()


const UserContext = ({children}) => {

    const [UserData, setUserData] = useState(null)
    console.log("DATA From Context",UserData)

    useEffect(() => {
        const user = localStorage.getItem('User')
        if (user) {
            setUserData(JSON.parse(user))
        }
    }, [])


  return (
    <UserDataContext.Provider value={{ UserData, setUserData }}>
        {children}
    </UserDataContext.Provider>
  )
}

export default UserContext