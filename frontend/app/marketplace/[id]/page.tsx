import React from 'react';

const Marketplace = ({ params }: { params: { id: string } }) => {

    return (
        <>
            l'id est : {params.id}
        </>
    )
}

export default Marketplace