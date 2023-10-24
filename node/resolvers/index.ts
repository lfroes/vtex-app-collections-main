export const sharedCollections = async (
    _: any,
    __: any,
    ctx: Context
) => {
    console.log('sharedCollections resolver');

    const collections = await ctx.clients.masterdata.searchDocuments<{
        collectionId: string;
    }>({
        dataEntity: 'collectionseller070',
        fields: ['collectionId'],
        pagination: {
            page: 1,
            pageSize: 100
        },
        schema: "v1"
    });

    console.log(collections, 'collections');

    if (!collections || collections === null) {
        return [];
    }

    return collections;
}


export const verify = async (
    _: any,
    __: any,
    ctx: Context
) => {
    console.log('verify resolver');

    const schema =  await ctx.clients.masterdata.getSchema({
        dataEntity: 'collectionseller070',
        schema: "v1"
    });

    if (!schema) {
        console.log('schema not found');
        await ctx.clients.vtex.createEntity();
        return false;
    }

    console.log('schema found');

    return true;
}

export const getCollections = async (
    _: any,
    __: any,
    ctx: Context
) => {
    console.log('getCollections resolver');

    const collections = await ctx.clients.vtex.getCollections();

    return collections.items;
}