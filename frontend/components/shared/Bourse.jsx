'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

const Bourse = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null);

    // useEffect asynchrone
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://dumbstockapi.com/stock?exchange=NYSE')
                setData(response.data);
            }
            catch (error) {
                console.log(error);
            }
            finally {
                setIsLoading(false)
            }
        }
        fetchData();

        return () => {
            // Qu'est ce qu'il se passe lorsque le composant est démonté ... annuler les abonnements ...Etc 
        }
    }, [])

    return (
        <div>
            {isLoading ? <div>Chargement ...</div> : (
                <>
                    {data.map(item => {
                        return (
                            <div key={item.ticker}>{item.name}</div>
                        )
                    })}
                </>
            )}
        </div>
    )
}

export default Bourse