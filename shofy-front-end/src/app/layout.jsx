import './globals.scss';
import './header-fix.css';
import {Jost, Roboto,Charm,Oregano, Poppins} from 'next/font/google';
import Providers from '@/components/provider';
import { ToastContainer } from "../utils/toast";
import { Icons } from 'react-toastify';


export const metadata = {
  title: 'LookFame',
  description: 'LookFame – Discover, shop, and stay in style with the latest fashion trends online.',
  icons: {
    icon: '/favicon.svg', // or '/favicon.png' if you use PNG
  },
}


console.log("Providers:", Providers);
console.log("ToastContainer:", ToastContainer);


const body = Jost({
  weight: ["300","400", "500", "600", "700", "800","900"],
  subsets: ["latin"],
  variable: "--tp-ff-body",
});
const heading = Jost({
  weight: ["300","400", "500", "600", "700", "800","900"],
  subsets: ["latin"],
  variable: "--tp-ff-heading",
});
const p = Jost({
  weight: ["300","400", "500", "600", "700", "800","900"],
  subsets: ["latin"],
  variable: "--tp-ff-p",
});
const jost = Jost({
  weight: ["300","400", "500", "600", "700", "800","900"],
  subsets: ["latin"],
  variable: "--tp-ff-jost",
});
const roboto = Roboto({
  weight: ["300","400","500","700","900"],
  subsets: ["latin"],
  variable: "--tp-ff-roboto",
});
const oregano = Oregano({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--tp-ff-oregano",
});
const charm = Charm({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--tp-ff-charm",
});
const poppins = Poppins({
  weight: ["300","400", "500", "600", "700", "800","900"],
  subsets: ["latin"],
  variable: "--tp-ff-poppins",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${body.variable} ${heading.variable} ${p.variable} ${jost.variable} ${roboto.variable} ${oregano.variable} ${charm.variable} ${poppins.variable}`}>
        <Providers>
          {children}
          <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        </Providers>
      </body>
    </html>
  )
}


