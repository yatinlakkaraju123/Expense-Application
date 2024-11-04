import Navbar from "./components/Navbar/Navbar"
function App() {
  

  return (
    <div className="bg-gradient-to-r from-red-200 to-yellow-200 h-screen w-screen">
     <div className='overflow-x-hidden '>
      <Navbar/>
     </div>
     <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
    </div>
  )
}

export default App
