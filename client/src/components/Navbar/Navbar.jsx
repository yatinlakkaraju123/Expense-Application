import React,{useState} from 'react'

const Navbar = () => {
    const [isMenuOpen,setIsMenuOpen] = useState(false);
    const toggleMenu = ()=>{
        setIsMenuOpen(!isMenuOpen);
    }
  return (
    <div>
      <nav className=' p-4'>
        <div className="flex items-center justify-between">
            {/*Logo */}
            <div className=" text-2xl font-bold">
                Expenses App
            </div>
            <div className="md:hidden">
                <button className='' onClick={toggleMenu}>
                    <svg
                    fill='none'
                    stroke='currentColor'
                    stroke-linecap='round'
                    stroke-width='2'
                    viewBox='0 0 24 24'
                    className='w-6 h-6'
                    >
                        <path d="M4 6h16M4 12h16M4 18h16"></path>

                    </svg>
                </button>
            </div>
            <ul className='hidden md:flex space-x-4'
            >
                <li><a href='#' className='hover:bg-yellow-100 p-4'>Home</a></li>
                <li><a href='#' className='hover:bg-yellow-100 p-4'>About</a></li>
                <li><a href='#' className='hover:bg-yellow-100 p-4'>Services</a></li>
                <li><a href='#' className='hover:bg-yellow-100 p-4'>Contact</a></li>
            </ul>
           
        </div>
        {isMenuOpen? (<ul className='flex-col md:hidden'
            >
                <li className='py-2'><a href='#' className='hover:bg-yellow-100 p-4'>Home</a></li>
                <li className='py-2'><a href='#' className='hover:bg-yellow-100 p-4'>About</a></li>
                <li className='py-2'><a href='#' className='hover:bg-yellow-100 p-4'>Services</a></li>
                <li className='py-2'><a href='#' className='hover:bg-yellow-100 p-4'>Contact</a></li>
            </ul>):null}
      </nav>
      
    </div>
  )
}

export default Navbar
