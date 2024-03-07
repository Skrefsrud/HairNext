// app/Header.tsx
import Link from "next/link";
export default function Header() {
  return (
    <header className='container mx-auto w-full  bg-transparent'>
      <div className='navbar bg-transparent'>
        <div className='flex-1'>
          <Link href='/' className='btn btn-ghost text-xl'>
            Hair Affair
          </Link>
        </div>
        <div className='flex-none'>
          <ul className='menu menu-horizontal px-1'>
            <li>
              <a>Link</a>
            </li>
            <li>
              <details>
                <summary>Parent</summary>
                <ul className='p-2 bg-base-100 rounded-t-none'>
                  <li>
                    <a>Link 1</a>
                  </li>
                  <li>
                    <a>Link 2</a>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
