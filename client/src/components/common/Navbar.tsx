function Navbar() {
  return (
    <nav className='bg-gray-100 py-4 md:px-8'>
      <div className='container mx-auto flex items-center justify-between'>
        <div className='text-lg font-bold'>My Logo</div>
        <div className='hidden md:flex space-x-6'>
          <a href='#' className='hover:text-blue-500'>
            Home
          </a>
          <a href='#' className='hover:text-blue-500'>
            About
          </a>
          <a href='#' className='hover:text-blue-500'>
            Contact
          </a>
        </div>
        <div className='md:hidden'>
          <button>
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4 6h16m-8 12v-2M8 18v-2'
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
