'use client'

import Link from "next/link";
import { useState } from "react";
import { useAccount } from "wagmi";
import Image from 'next/image'
import CustomConnectButton from "./CustomConnectButton";


const Header = () => {
    const [activeLink, setActiveLink] = useState('/'); // État pour le lien actif

    const { isConnected, address } = useAccount();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuLinkClasses = "text-white hover:text-purple-100 transition-colors relative group font-montserrat text-sm uppercase tracking-wider font-medium px-4";
    const mobileLinkClasses = "block w-full text-white hover:bg-purple-400/20 px-3 py-2 rounded-md transition-colors font-montserrat text-sm uppercase tracking-wider font-medium text-center";

    
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <nav className="border-gray-200 py-2.5 bg-gray-900">
                <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto">
                    <a href="#" className="flex items-center">
                        <Image
                            src="/images/nobleworld-logo.png"
                            width={50}
                            height={50}
                            alt="Picture of the author"
                        />
                        <span className="self-center text-xl font-semibold whitespace-nowrap text-white pl-1 font-dancing">
                            Noble World
                        </span>
                    </a>
                    <div className="flex items-center lg:order-2">
                        <div className="hidden mt-2 mr-4 sm:inline-block">
                            <span></span>
                        </div>
                        {<CustomConnectButton />}
                        <button data-collapse-toggle="mobile-menu-2" type="button" onClick={toggleMenu} 
                            className="inline-flex items-center p-2 ml-2 text-sm rounded-lg lg:hidden focus:outline-none focus:ring-2 text-gray-400 hover:bg-gray-700 focus:ring-gray-600"
                            aria-controls="mobile-menu-2" aria-expanded={isMenuOpen}>
                                <span className="sr-only">Open main menu</span>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd"
                                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                        clipRule="evenodd"></path>
                                </svg>
                                <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"></path>
                                </svg>
                        </button>
                    </div>
                    <div className={`items-center justify-between w-full lg:flex lg:w-auto lg:order-1 ${isMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu-2">
                        <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                            <li>
                                <Link href="/" className={`${activeLink === '/' ? 'text-white' : 'text-gray-400 hover:text-white'} block py-2 pl-3 pr-4 border-b lg:hover:bg-transparent lg:border-0 lg:p-0 text-gray-400 lg:hover:text-white hover:bg-gray-700 hover:text-white border-gray-700`} onClick={() => setActiveLink('/')}>Home</Link>
                            </li>
                            <li>
                                <Link href="/gallery" className={`${activeLink === '/gallery' ? 'text-white' : 'text-gray-400 hover:text-white'} block py-2 pl-3 pr-4 border-b lg:hover:bg-transparent lg:border-0 lg:p-0 text-gray-400 lg:hover:text-white hover:bg-gray-700 hover:text-white border-gray-700 focus:text-white`} onClick={() => setActiveLink('/gallery')}>Gallery</Link>
                            </li>
                            <li>
                                <Link href="/sales" className={`${activeLink === '/sales' ? 'text-white' : 'text-gray-400 hover:text-white'} block py-2 pl-3 pr-4 border-b lg:hover:bg-transparent lg:border-0 lg:p-0 text-gray-400 lg:hover:text-white hover:bg-gray-700 hover:text-white border-gray-700 focus:text-white`} onClick={() => setActiveLink('/sales')}>Sales</Link>
                            </li>
                            <li>
                                <Link href="/purchases" className={`${activeLink === '/purchases' ? 'text-white' : 'text-gray-400 hover:text-white'} block py-2 pl-3 pr-4 border-b lg:hover:bg-transparent lg:border-0 lg:p-0 text-gray-400 lg:hover:text-white hover:bg-gray-700 hover:text-white border-gray-700 focus:text-white`} onClick={() => setActiveLink('/purchases')}>Purchases</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header
