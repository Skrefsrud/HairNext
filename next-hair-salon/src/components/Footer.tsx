// app/Footer.tsx
import Link from "next/link";
import { FacebookIcon, InstagramIcon, MailIcon } from "@/app/Icons";

export default function Footer() {
  return (
    <footer
      key="1"
      className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6 md:py-12"
    >
      {/* Social Links */}
      <div className="flex flex-col items-center gap-4 px-4 md:px-6">
        <div className="text-center">
          <h6 className="footer-title">Social</h6>
          <div className="grid grid-flow-col gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FacebookIcon className="fill-current" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <InstagramIcon className="fill-current" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="flex flex-col items-center gap-4 px-4 md:px-6">
        <div className="text-center">
          <div className="flex items-center gap-1 text-sm">
            <span className="sr-only">Email:</span>
            <MailIcon className="w-4 h-4 fill-muted" />
            <Link className="hover:underline" href="/contact">
              Contact Us
            </Link>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Phone: 123-456-7890
          </span>
        </div>
      </div>

      {/* Links and Copyright */}
      <div className="flex flex-col items-center gap-4 px-4 md:px-6 text-center">
        <nav>
          <ul className="flex flex-col gap-2">
            <li>
              <Link className="text-sm hover:underline" href="/terms">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link className="text-sm hover:underline" href="/privacy">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </nav>
        <p className="text-xs tracking-wide text-gray-500 dark:text-gray-400">
          © 2023 Acme Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
