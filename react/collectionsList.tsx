import React, { useState, useMemo, useContext, useEffect } from 'react'
import Spinner from '@vtex/styleguide/lib/Spinner'

import { useQuery, useLazyQuery, useApolloClient } from 'react-apollo'
import ButtonWithIcon from '@vtex/styleguide/lib/ButtonWithIcon'
import Delete from '@vtex/styleguide/lib/icon/Delete'

/* @ts-ignore */
import verify from './graphql/verify.gql'
/* @ts-ignore */
import sharedCollections from './graphql/sharedCollections.gql'
/* @ts-ignore */
import removeCollection from './graphql/removeCollection.gql'

import { CollectionsContext } from './hooks/index'


const remove = <Delete />

const NotFound = () => {
    return (
        <section className='flex flex-column justify-center items-center '>
            <h1>Nenhuma coleção compartilhada</h1>
            <p>Parece que não está compartilhando nenhuma coleção no momento</p>
        </section>
    )
}

const CollectionsList = () => {
    const [loading, setLoading] = useState(true);
    const { data, error, refetch } = useQuery(verify, {
        fetchPolicy: 'no-cache'
    });
    const [collections, setCollections] = useState([]);
    const { updateCollections, setUpdateCollections } = useContext(CollectionsContext);
    const client = useApolloClient();

    const [getCollection, {data: collectionsData, error: collectionError, refetch: collectionRefetch}] = useLazyQuery(sharedCollections, {
        fetchPolicy: 'no-cache'
    })

    useMemo(() => {
        if (data?.verify) {
            console.log(data, 'data verify')
            return getCollection();
        } else {
            const timer = setTimeout(() => {
                refetch()
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [data, error]);


    useMemo(() => {
        console.log('collectionsData memo')
        if (collectionsData) {
            console.log(collectionsData, 'collectionsData');
            setCollections(collectionsData.sharedCollections);
            return setLoading(false)
        }
    }, [collectionsData, collectionError, collectionRefetch]);

    const handleRemove = async (id) => {
        console.log(id, 'id')
        client.mutate({
            mutation: removeCollection,
            variables: {
                collectionId: id.toString()
            }
        }).then((data) => {
            console.log(data, 'data')
            setUpdateCollections(true);
        }).catch((err) => {
            console.log(err, 'err')
        })
    }

    useEffect(() => {
        if (updateCollections) {
            setLoading(true);

            const timer = setTimeout(() => {
                console.log('updateCollections')
                collectionRefetch();
                setLoading(false);
                setUpdateCollections(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [updateCollections])


    const renderCollections = useMemo(() => {
        if (loading) {
            return (
                <section className="flex justify-center">
                    <Spinner />
                </section>
            )
        }

        if (collections.length === 0) {
            return <NotFound />
        }

        if (collections.length > 0) {
            return (
                <section>
                    <h1>Coleções compartilhadas</h1>
                    <table className='w-100'>
                        <tr className='flex justify-between items-center w-100'>
                            <th className='w-30'>Nome</th>
                            <th className='w-30'>Produtos</th>
                            <th className='w-30'>Ações</th>
                        </tr>
                        {
                            collections.map((collection: any) => {
                                return (
                                    <tr key={collection.id} className='flex justify-between items-center w-100'>
                                        <td className='w-30 flex justify-center'>{collection.name}</td>
                                        <td className='w-30 flex justify-center'>Produtos: {collection.totalProducts}</td>
                                        <td className='w-30 flex justify-center'>
                                            <ButtonWithIcon icon={remove} variation="danger" onClick={() => handleRemove(collection.id)}>
                                                Remover
                                            </ButtonWithIcon>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        {/* {
                            collections.map((collection: any) => {
                                return (
                                    <section key={collection.id} className='flex justify-between items-center w-100'>
                                        <p className='f4 lh-copy'>{collection.name}</p>
                                        <p className='f4 lh-copy'>Produtos: {collection.totalProducts}</p>
                                        <ButtonWithIcon icon={remove} variation="danger" onClick={() => handleRemove(collection.id)}>
                                            Remover
                                        </ButtonWithIcon>
                                    </section>
                                )
                            })
                        } */}
                    </table>
                </section>
            )
        }
    }, [collections, loading]);


    
    return (
        <section>
            {
                renderCollections
            }
        </section>
    )
}

export default CollectionsList