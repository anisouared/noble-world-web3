import React, { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { disconnect } from "@wagmi/core";
import { useDisconnect } from "wagmi";

const CustomConnectButton = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // État pour gérer l'ouverture du dropdown
  const { disconnect } = useDisconnect();

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready && account && chain && (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="text-white focus:ring-2 focus:ring-purple-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 bg-purple-600 hover:bg-purple-700 focus:ring-purple-800"
                  >
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="text-white focus:ring-2 focus:ring-red-500 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 bg-red-500 hover:bg-red-500 focus:ring-red-500"
                  >
                    Wrong network
                  </button>
                );
              }
              return (
                <div style={{ display: "flex", gap: 12, position: "relative" }}>
                  {chain.hasIcon && (
                    <div
                      style={{
                        background: "grey",
                        width: 120,
                        borderRadius: 900,
                        overflow: "hidden",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {chain.iconUrl && (
                        <button
                          onClick={openChainModal}
                          style={{ display: "flex", alignItems: "center" }}
                          type="button"
                        >
                          <img alt={chain.name ?? "Chain icon"} src={chain.iconUrl} />
                          <span className="ml-1.5 text-white font-medium">{account.displayBalance}</span>
                        </button>
                      )}
                    </div>
                  )}
                  <button
                    id="dropdownDelayButton"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown
                    className="text-white bg-purple-600 hover:bg-purple-700 focus:ring-2 focus:outline-none focus:ring-purple-800 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center inline-flex items-center"
                    type="button"
                  >
                    {account.displayName}
                    <svg
                      className="w-2.5 h-2.5 ms-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                  </button>
                  {isDropdownOpen && ( // Affiche le dropdown si l'état est ouvert
                    <div className="absolute z-50 divide-y rounded-lg shadow w-44 mt-12 ml-11 bg-gray-700 divide-gray-600">
                      <ul className="py-2 text-sm text-gray-200" aria-labelledby="dropdownDelayButton">
                        <li onClick={openAccountModal}>
                          <a href="#" className="block px-4 py-2 hover:bg-gray-600 hover:text-white">
                            Account
                          </a>
                        </li>
                        <li>
                          <a href="/products" className="block px-4 py-2 hover:bg-gray-600 hover:text-white">
                            My NFTs (Products)
                          </a>
                        </li>
                        <li onClick={() => disconnect()}>
                          <a href="#" className="block px-4 py-2 hover:bg-gray-600 hover:text-white">
                            Logout
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomConnectButton;
