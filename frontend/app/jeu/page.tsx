'use client'
import Link from "next/link";
import { useState, useEffect } from "react"

const Jeu = () => {
    const [number, setNumber] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const handleButtonClick = () => {
        setNumber(number + 1);
    }

    // Si tableau de dépendance vide, le useEffect signifie, que se passe-t-il lorsque mon composant est pret ?
    useEffect(() => {
        console.log('Le jeu est prêt car le composant est monté.');
        setIsLoading(false);
    }, [])

    // Qu'est ce qu'il se passe lorsque number change
    useEffect(() => {
        console.log('Le State `number` a changé');
    }, [number])

    // Quand quelque chose a changé dans la page (n'importe quoi)
    useEffect(() => {
        console.log("Quelque chose a changé (state number, state isLoading, default d'une valeur")
    })

    // Le composant est démonté
    useEffect(() => {
        return () => {
            console.log('Le composant est démonté (quand je retourne à la home par exemple, ou arreter des abonnements ...)');
        }
    })

    return (
        <>
            {
                isLoading ? (
                    <div>Chargement ....</div>
                ) : (
                    <>
                        <div>Jeu {number}</div>
                        <button onClick={handleButtonClick}>Click</button><br />
                        <Link href="/">Retour sur la home</Link>
                    </>
                )
            }

        </>
    )
}

export default Jeu