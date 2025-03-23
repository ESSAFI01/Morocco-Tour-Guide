import React, { useState, useEffect } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './Auth/AuthProvider';

export default function Nav() {
    const [navbar, setNavbar] = useState(false);
    const auth = useAuth();
    const isAuthenticated = auth?.isAuthenticated;
    const logout = auth?.logout;
    const location = useLocation();

    // Close mobile menu when route changes
    useEffect(() => {
        setNavbar(false);
    }, [location]);

    return (
        <>
            {/* Main Navbar */}
            <div className="fixed top-4 left-4 right-4 flex justify-between items-center h-16 bg-white/55 backdrop-blur-md px-4 sm:px-6 rounded-lg max-w-5xl mx-auto z-[1000]">
                {/* Logo - always visible */}
                <div className="flex-shrink-0">
                    <Link to="/" className="flex items-center">
                        {/* Custom SVG Logo */}
                        <div className="flex items-center">
                            <svg
                                width="38"
                                height="38"
                                viewBox="0 0 120 120"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="mr-2 flex-shrink-0"
                            >
                                {/* SVG paths remain the same */}
                                <path
                                    d="M60 10C32.4 10 10 32.4 10 60C10 87.6 32.4 110 60 110C87.6 110 110 87.6 110 60C110 32.4 87.6 10 60 10Z"
                                    fill="#FBB03B"
                                    fillOpacity="0.2"
                                />
                                <path
                                    d="M85 40C85 40 85 70 85 80C85 97.3 71.6 110 55 110C38.4 110 25 97.3 25 80C25 70 25 40 25 40"
                                    stroke="#C87137"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M40 55L60 35L80 55"
                                    stroke="#C87137"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M45 75H75"
                                    stroke="#333"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M50 85H70"
                                    stroke="#333"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                                <circle cx="40" cy="75" r="3" fill="#333" />
                                <circle cx="80" cy="75" r="3" fill="#333" />
                                <circle cx="45" cy="85" r="3" fill="#333" />
                                <circle cx="75" cy="85" r="3" fill="#333" />
                            </svg>
                            
                            {/* Logo Text - hidden on smallest screens */}
                            <div className="hidden sm:flex flex-col">
                                <span className="text-lg font-bold leading-none tracking-tight bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                                    Morocco Guide
                                </span>
                                <span className="text-xs text-gray-600 flex items-center">
                                    Guided by
                                    <span className="ml-1 font-medium text-amber-600">
                                        AI
                                    </span>
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <ul className="hidden md:flex space-x-4 lg:space-x-6 text-black text-lg items-center">
                    <li>
                        <Link to="/chat" className="hover:underline">Chat</Link>
                    </li>

                    <li className="group">
                        {!isAuthenticated ? (
                            <Link
                                to="/login"
                                className="px-4 py-2 rounded-md transition-all duration-300 hover:text-black hover:bg-white/90 flex items-center space-x-1"
                            >
                                <span>Login</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>) : (
                            <button onClick={logout}
                                className="px-4 py-2 rounded-md transition-all duration-300 hover:text-black hover:bg-white/90 flex items-center space-x-1"
                            >
                                <span>Logout</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        )}
                    </li>
                </ul>

                {/* Mobile Menu Toggle Button */}
                <button 
                    onClick={() => setNavbar(!navbar)} 
                    className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-white/20 transition-colors"
                    aria-label="Toggle menu"
                >
                    {navbar ? <AiOutlineClose size={24} className="text-black" /> : <AiOutlineMenu size={24} className="text-black" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div 
                className={`fixed inset-0 bg-black/50 z-[990] md:hidden transition-opacity duration-300 ${
                    navbar ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setNavbar(false)}
            ></div>

            {/* Mobile Menu Sidebar */}
            <div className={`rounded fixed top-0 left-0 bottom-0 w-[75%] max-w-[300px] bg-black/90 backdrop-blur-md text-white p-6 pt-9 z-[1001] transform transition-transform duration-300 md:hidden ${
                navbar ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="flex items-center mb-8">
                    <Link to="/" onClick={() => setNavbar(false)} className="flex items-center">
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 120 120"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-2"
                        >
                            <path
                                d="M60 10C32.4 10 10 32.4 10 60C10 87.6 32.4 110 60 110C87.6 110 110 87.6 110 60C110 32.4 87.6 10 60 10Z"
                                fill="#FBB03B"
                                fillOpacity="0.2"
                            />
                            <path
                                d="M85 40C85 40 85 70 85 80C85 97.3 71.6 110 55 110C38.4 110 25 97.3 25 80C25 70 25 40 25 40"
                                stroke="#FBB03B"
                                strokeWidth="6"
                                strokeLinecap="round"
                            />
                            <path
                                d="M40 55L60 35L80 55"
                                stroke="#FBB03B"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M45 75H75"
                                stroke="#FFFFFF"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                            <path
                                d="M50 85H70"
                                stroke="#FFFFFF"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                            <circle cx="40" cy="75" r="3" fill="#FFFFFF" />
                            <circle cx="80" cy="75" r="3" fill="#FFFFFF" />
                            <circle cx="45" cy="85" r="3" fill="#FFFFFF" />
                            <circle cx="75" cy="85" r="3" fill="#FFFFFF" />
                        </svg>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold leading-none text-white">
                                Morocco Guide
                            </span>
                            <span className="text-xs text-amber-300">
                                Guided by AI
                            </span>
                        </div>
                    </Link>
                </div>

                <nav>
                    <ul className="space-y-4">
                        <li className="border-b border-white/20 pb-3">
                            <Link 
                                to="/chat" 
                                onClick={() => setNavbar(false)} 
                                className="block w-full hover:text-amber-300 transition-colors"
                            >
                                Chat with our AI Guide
                            </Link>
                        </li>
                        <li className="pt-3">
                            {!isAuthenticated ? (
                                <Link
                                    to="/login"
                                    onClick={() => setNavbar(false)}
                                    className="block w-full px-4 py-2 rounded-md bg-amber-600 hover:bg-amber-700 text-center transition-colors"
                                >
                                    Login
                                </Link>
                            ) : (
                                <button
                                    onClick={() => {
                                        logout && logout();
                                        setNavbar(false);
                                    }}
                                    className="block w-full px-4 py-2 rounded-md bg-amber-600 hover:bg-amber-700 text-center transition-colors"
                                >
                                    Logout
                                </button>
                            )}
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
}