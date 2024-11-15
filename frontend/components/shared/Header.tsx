'use client'

import Link from "next/link";
import { useState } from "react";

const Logo = () => (
    <Link href="/" className="flex items-center">
        <svg
            width="36"
            height="36"
            viewBox="0 0 40 40"
            className="text-white md:w-[40px] md:h-[40px]"
        >
            <g>
                <path
                    d="M20 0L37.3205 30H2.67949L20 0Z"
                    className="fill-white/20"
                />
                <path
                    d="M20 8L31.7128 28H8.28718L20 8Z"
                    className="fill-white/40"
                />
                <path
                    d="M20 16L26.1051 26H13.8949L20 16Z"
                    className="fill-white"
                />
            </g>
        </svg>
    </Link>
);

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuLinkClasses = "text-white hover:text-purple-100 transition-colors relative group font-montserrat text-sm uppercase tracking-wider font-medium px-4";
    const mobileLinkClasses = "block w-full text-white hover:bg-purple-400/20 px-3 py-2 rounded-md transition-colors font-montserrat text-sm uppercase tracking-wider font-medium text-center";

    return (
        <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 shadow-lg">
            <div className="max-w-5xl mx-auto px-6">
                {/* Desktop Menu */}
                <div className="hidden md:flex items-center justify-center relative py-4">
                    <div className="absolute left-0">
                        <Logo />
                    </div>
                    <ul className="flex gap-16 items-center">
                        <li>
                            <Link href="/" className={menuLinkClasses}>
                                <span>Home</span>
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                            </Link>
                        </li>
                        <li>
                            <Link href="/annonces" className={menuLinkClasses}>
                                <span>Annonces</span>
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                            </Link>
                        </li>
                        <li>
                            <Link href="/marketplace" className={menuLinkClasses}>
                                <span>Marketplace</span>
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden py-4">
                    <div className="flex justify-between items-center">
                        <Logo />
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-white hover:text-purple-100 focus:outline-none"
                        >
                            {isMenuOpen ? (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <div className={`transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-48 opacity-100 mt-4' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                        <ul className="flex flex-col items-center space-y-2">
                            <li className="w-full">
                                <Link href="/" className={mobileLinkClasses} onClick={() => setIsMenuOpen(false)}>
                                    Home
                                </Link>
                            </li>
                            <li className="w-full">
                                <Link href="/annonces" className={mobileLinkClasses} onClick={() => setIsMenuOpen(false)}>
                                    Annonces
                                </Link>
                            </li>
                            <li className="w-full">
                                <Link href="/marketplace" className={mobileLinkClasses} onClick={() => setIsMenuOpen(false)}>
                                    Marketplace
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
