import React, { useState, useCallback, useEffect, useContext } from 'react'
import ButtonWithIcon from '@vtex/styleguide/lib/ButtonWithIcon'
import PlusLines from '@vtex/styleguide/lib/icon/PlusLines'
import Modal from '@vtex/styleguide/lib/Modal'
import InputSearch from '@vtex/styleguide/lib/InputSearch'


import { useApolloClient } from 'react-apollo';
import { CollectionsContext } from './hooks/index'

/* @ts-ignore */
import collections from './graphql/collections.gql'
/* @ts-ignore */
import addCollection from './graphql/addCollection.gql'

const plus = <PlusLines />;

const CollectionsOptions = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { setUpdateCollections } = useContext(CollectionsContext);

    const client = useApolloClient();

    const getCollections = async (searchParam) => {
        console.log(searchParam, 'searchParam')
        const { data } = await client.query({
            query: collections,
            fetchPolicy: 'no-cache',
            variables: {
                searchKey: searchParam
            }
        });

        if (data.collections.items.length === 0) {
            return setSearchResult([]);
        }

        console.log(data.collections.items, 'data collections')

        return setSearchResult(data.collections.items);
    }

    useEffect(() => {
        if (searchTerm.length > 0) {
            getCollections(searchTerm);
            console.log(searchTerm, 'searchTerm')
        }
    }, [searchTerm])


    const handleAdd = (collection) => {
        console.log(typeof collection.id, 'collection')
        client.mutate({
            mutation: addCollection,
            variables: {
                collectionId: collection.id
            }
        }).then((data) => {
            console.log(data, 'data')
            setUpdateCollections(true);
            setModalOpen(false);
        }).catch((err) => {
            console.log(err, 'err')
        })
    };



    return (
        <section>
            <ButtonWithIcon icon={plus} variation="primary" iconPosition="right" onClick={() => setModalOpen(true)}>Adicionar Coleção</ButtonWithIcon>
            <Modal centered isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                <section className='flex flex-column items-center'>
                    <h1>Adicionar Coleção</h1>
                    <InputSearch placeholder="Buscar Coleção" size="regular" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>

                    {
                       searchResult.length > 0 && searchResult.map((collection: any) => {
                            return (
                                <section key={collection.id} className='flex justify-between items-center w-100'>
                                    <p>{collection.name}</p>
                                    <ButtonWithIcon icon={plus} variation="primary" iconPosition="right" onClick={() => handleAdd(collection)}>Adicionar</ButtonWithIcon>
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