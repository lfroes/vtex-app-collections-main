import React, { useState, useMemo } from 'react'
import Spinner from '@vtex/styleguide/lib/Spinner'

import { useQuery, useLazyQuery, useApolloClient } from 'react-apollo'

/* @ts-ignore */
import verify from './graphql/verify.gql'
/* @ts-ignore */
import sharedCollections from './graphql/sharedCollections.gql'

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
    const { data, error, refetch } = useQuery(verify);
    const [collections, setCollections] = useState([]);

    const [getCollection, {data: collectionsData, error: collectionError}] = useLazyQuery(sharedCollections, {
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
        if (collectionsData) {
            console.log(collectionsData, 'collectionsData');
            setCollections(collectionsData.sharedCollections);
            return setLoading(false)
        }
    }, [collectionsData, collectionError]);


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
                    <h1>Teste</h1>
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