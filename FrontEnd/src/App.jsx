import React from 'react'
import Start from './Pages/Start'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RouteProtector from './Components/RouteProtector'
import Home from './Pages/Home'
import PostProperty from './Pages/PostProperty'
import Listings from './Pages/Listings'
import UpdateProperty from './Components/UpdateProperty'
import Favorites from './Pages/Favorites'

const router = createBrowserRouter([
    {
      path: '/',
      element: <div><Start/></div>
    },
    {
      path: '/home',
      element: <div><RouteProtector> <Home/> </RouteProtector></div>
    },
    {
      path: '/Post/Property',
      element: <div><RouteProtector> <PostProperty/> </RouteProtector></div>
    },
    {
      path: '/Property/Listing',
      element: <div><RouteProtector> <Listings/> </RouteProtector></div>
    },
    {
      path: '/update/Property',
      element: <div><RouteProtector> <UpdateProperty/> </RouteProtector></div>
    },
    {
      path: '/favorites/Property',
      element: <div><RouteProtector> <Favorites/> </RouteProtector></div>
    }
])

const App = () => {
  return (
    <div>
      <RouterProvider router={router}> 
      </RouterProvider>
    </div>
  )
}

export default App