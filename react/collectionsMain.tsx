import React from 'react'
import Layout from '@vtex/styleguide/lib/Layout'
import PageBlock from '@vtex/styleguide/lib/PageBlock'
import CollectionsList from './collectionsList'
import CollectionsOptions from './collectionsOptions'

import { CollectionsProvider } from './hooks'

const collectionsMain = () => {
    return (
        <CollectionsProvider>
            <Layout fullWidth>
                <section className='mt5'>
                    <PageBlock variation="aside">
                        <section><CollectionsList /></section>
                        <section><CollectionsOptions /></section>
                    </PageBlock>
                </section>
            </Layout>
        </CollectionsProvider>

    )
}

export default collectionsMain