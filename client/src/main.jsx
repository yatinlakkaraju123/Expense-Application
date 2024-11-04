import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

// Import the layouts
import RootLayout from './components/RootLayout'
import DashboardLayout from './components/DashboardLayout'

// Import the components
import IndexPage from './components/IndexPage'
import AddExpenses from './components/AddExpenses';
import ViewExpenses from './components/ViewExpenses';
import SignInPage from './components/SignInPage'
import SignUpPage from './components/SignUpPage'
import DashboardPage from './components/DashboardPage'
import ViewCategories from './components/ViewCategories'

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <IndexPage /> },
     
      { path: '/sign-in/*', element: <SignInPage /> },
      { path: '/sign-up/*', element: <SignUpPage /> },
      {
        element: <DashboardLayout />,
        path: 'App',
        children: [
          { path: 'App', element: <DashboardPage /> },
          {path:'/App/AddExpense',element:<AddExpenses/>},
          { path: '/App/ViewExpense', element:<ViewExpenses/>},
          {path:'/App/ViewCategories',element:<ViewCategories/>}
         
        ],
      },
    ],
  },
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <RouterProvider router={router} />
  </React.StrictMode>,
)
