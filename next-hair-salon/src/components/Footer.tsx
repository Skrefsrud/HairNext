// app/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer key='1' className='grid grid-cols-3 '>
      <div className='py-6 md:py-12'>
        <div className='container flex flex-col items-center gap-4 px-4 md:px-6'>
          <div className='flex flex-col items-center gap-2 text-center'>
            <h6 className='footer-title'>Social</h6>
            <div className='grid grid-flow-col gap-4'>
              <a>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  className='fill-current'
                >
                  <path d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z'></path>
                </svg>
              </a>
              <a>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  className='fill-current'
                >
                  <path d='M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z'></path>
                </svg>
              </a>
              <a>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  className='fill-current'
                >
                  <path d='M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z'></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className='py-6 md:py-12'>
        <div className='container flex flex-col items-center gap-4 px-4 md:px-6'>
          <div className='flex flex-col items-center gap-2 text-center'>
            <div className='flex items-center gap-1 text-sm'>
              <span className='sr-only'>Email:</span>
              <MailIcon className='w-4 h-4 fill-muted' />
              <Link className='hover:underline' href='#'>
                Contact Us
              </Link>
            </div>
            <span className='text-xs text-gray-500 dark:text-gray-400'>
              Phone: 123-456-7890
            </span>
          </div>
        </div>
      </div>
      <div className='py-6 md:py-12'>
        <div className='container flex flex-col items-center gap-4 px-4 md:px-6'>
          <nav className='flex flex-col gap-2 text-center'>
            <ul className='flex flex-col gap-2'>
              <li>
                <Link className='text-sm hover:underline' href='#'>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link className='text-sm hover:underline' href='#'>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </nav>
          <div className='flex flex-col items-center gap-2 text-center'>
            <p className='text-xs tracking-wide text-gray-500 dark:text-gray-400'>
              © 2023 Acme Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FacebookIcon(props) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' />
    </svg>
  );
}

function InstagramIcon(props) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <rect width='20' height='20' x='2' y='2' rx='5' ry='5' />
      <path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' />
      <line x1='17.5' x2='17.51' y1='6.5' y2='6.5' />
    </svg>
  );
}

function MailIcon(props) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <rect width='20' height='16' x='2' y='4' rx='2' />
      <path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' />
    </svg>
  );
}
