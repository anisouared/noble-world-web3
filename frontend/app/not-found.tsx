import React from 'react'
import Link from 'next/link'

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center space-y-6 p-8">
                <h1 className="text-9xl font-bold text-gray-800">404</h1>

                <div className="space-y-2">
                    <h2 className="text-3xl font-semibold text-gray-700">
                        Page non trouvée
                    </h2>
                    <p className="text-gray-500">
                        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
                    </p>
                </div>

                <Link
                    href="/"
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg
                             hover:bg-blue-700 transition-colors duration-200"
                >
                    Retour à l'accueil
                </Link>
            </div>
        </div>
    )
}

export default NotFoundPage