import React, { useState, useCallback } from 'react'
import ButtonWithIcon from '@vtex/styleguide/lib/ButtonWithIcon'
import PlusLines from '@vtex/styleguide/lib/icon/PlusLines'
import Modal from '@vtex/styleguide/lib/Modal'
import InputSearch from '@vtex/styleguide/lib/InputSearch'


import { useApolloClient } from 'react-apollo';

/* @ts-ignore */
import collections from './graphql/collections.gql'

const plus = <PlusLines />;

const CollectionsOptions = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [searchResult, setSearchResult] = useState([]);

    const client = useApolloClient();

    const getCollections = async (e) => {
        console.log(e, 'searchRef');
        // const { data } = await client.query({
        //     query: collections,
        //     variables: {
        //         searchTerm: searchRef.current.value
        //     }
        // });

        // setSearchResult(data.collections.items);
    }



    return (
        <section>
            <ButtonWithIcon icon={plus} variation="primary" iconPosition="right" onClick={() => setModalOpen(true)}>Adicionar Coleção</ButtonWithIcon>
            <Modal centered isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                <section className='flex flex-column items-center'>
                    <h1>Adicionar Coleção</h1>
                    <InputSearch placeholder="Buscar Coleção" size="regular" onChange={(e : any) => getCollections(e)}/>

                    {
                       searchResult.length > 0 && searchResult.map((collection: any) => {
                            return (
                                <section key={collection.id} className='flex justify-between items-center w-100'>
                                    <p>{collection.name}</p>
                                    <ButtonWithIcon icon={plus} variation="primary" iconPosition="right" onClick={() => console.log(collection)}>Adicionar</ButtonWithIcon>
                                </section>
                            )
                        })
                    }
                </section>
            </Modal>
        </section>
    )
}


export default CollectionsOptions