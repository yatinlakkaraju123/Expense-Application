import { Link, Outlet, useNavigate } from 'react-router-dom'
import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import React,{useState} from 'react'
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

export default function RootLayout() {
  const navigate = useNavigate()
  const [isMenuOpen,setIsMenuOpen] = useState(false);
    const toggleMenu = ()=>{
        setIsMenuOpen(!isMenuOpen);
    }

  return (
    <ClerkProvider
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      publishableKey={PUBLISHABLE_KEY}
    >
      <header className="header bg-gradient-to-r from-red-200 to-yellow-200">
        <div className='flex items-center justify-between font-bold'>
          <div className='m-2'>
            <Link to="/"><p className='text-2xl '>Expenses Application</p></Link>
          </div>
          <div className="md:hidden">
                <button className='' onClick={toggleMenu}>
                    <svg
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeWidth='2'
                    viewBox='0 0 24 24'
                    className='w-6 h-6'
                    >
                        <path d="M4 6h16M4 12h16M4 18h16"></path>

                    </svg>
                </button>
            </div>

          <ul className='hidden md:flex space-x-4'>
           
            
             
              <li className='m-2'><Link to="/App/AddExpense"><p className='hover:bg-yellow-100 p-4'>Add Expenses</p></Link></li>
              <li className='m-2'><Link to="/App/ViewExpense"><p className='hover:bg-yellow-100 p-4'> View Expenses</p> </Link></li>
              <li className='m-2'><Link to="/App/ViewCategories"><p className='hover:bg-yellow-100 p-4'> Add/View Categories</p> </Link></li>
              <li className='m-2 hover:bg-yellow-100 p-4'> 
              <SignedIn>
                <UserButton />
              </SignedIn>
            </li>
              <li className='m-2 hover:bg-yellow-100 p-4'>  <SignedOut>
                <Link to="/sign-in">Sign In</Link>
              </SignedOut>
             
            </li>
          </ul>


        </div>
        {isMenuOpen? (<ul className='flex-col md:hidden'
            >
                  <li className='m-2'><Link to="/App/AddExpense"><p className='hover:bg-yellow-100 p-4'>Add Expenses</p></Link></li>
              <li className='m-2'><Link to="/App/ViewExpense"><p className='hover:bg-yellow-100 p-4'> View Expenses</p> </Link></li>
              <li className='m-2'><Link to="/App/ViewCategories"><p className='hover:bg-yellow-100 p-4'> Add/View Categories</p> </Link></li>
              <li className='m-2 hover:bg-yellow-100 p-4'> 
              <SignedIn>
                <UserButton />
              </SignedIn>
            </li>
              <li className='m-2 hover:bg-yellow-100 p-4'>  <SignedOut>
                <Link to="/sign-in">Sign In</Link>
              </SignedOut>
             
            </li>
            </ul>):null}
      </header>
      <main className='bg-gradient-to-r from-red-200 to-yellow-200 h-screen w-screen'>
        <Outlet />
      </main>
    </ClerkProvider>
  )
}