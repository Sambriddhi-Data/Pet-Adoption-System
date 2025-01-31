import React from 'react'

async function PetInfoPage({
    params,
}: {
    params: Promise<{ petId: string }>;
}) {
    const petId = (await params).petId;
    return (
        <div>PetInfoPage {petId}</div>
    )
}
[]
export default PetInfoPage;