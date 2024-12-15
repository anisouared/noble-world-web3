'use client'
import React from 'react'
import Header from "./Header"
import Footer from "./Footer"
import NotAuthorized from "./NotAuthorized"
import { useAccount } from "wagmi";

const Layout = ({ children }: Readonly<{
    children: React.ReactNode;
  }>) => {
  const { isConnected } = useAccount();

  return (
    <div className="app">
        <Header />
        {isConnected ? (
            <main className="main">
                {children}
            </main>
        ) : (
            <NotAuthorized />
        )}
        <Footer />
    </div>
  )
}

export default Layout