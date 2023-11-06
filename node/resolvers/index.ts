export const sharedCollections = async (
    _: any,
    __: any,
    ctx: Context
) => {
    console.log('sharedCollections resolver');

    const collections = await ctx.clients.masterdata.searchDocuments<{
        collectionId: string;
    }>({
        dataEntity: 'collectionseller071',
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

    let collectionsList: any = [];

    await Promise.all(collections.map(async (collection) => {
        const collectionData = await ctx.clients.vtex.getCollection(collection.collectionId);	

        console.log(collectionData, 'collectionData');

        if (!collectionData || collectionData === null) {
            return;
        }

        collectionsList.push(collectionData);

        return;

    }));

    return collectionsList;
}


export const verify = async (
    _: any,
    __: any,
    ctx: Context
) => {
    console.log('verify resolver');

    const schema =  await ctx.clients.masterdata.getSchema({
        dataEntity: 'collectionseller071',
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

export const addCollection = async (
    _: any,
    { collectionId }: { collectionId: string },
    ctx: Context
) => {
    console.log('addCollection resolver');

    const schema =  await ctx.clients.masterdata.getSchema({
        dataEntity: 'collectionseller071',
        schema: "v1"
    });

    if (!schema) {
        console.log('schema not found');
        return false;
    }

    const collectionAlreadyExists = await ctx.clients.masterdata.searchDocuments<{
        collectionId: string;
    }>({
        dataEntity: 'collectionseller071',
        fields: ['collectionId'],
        pagination: {
            page: 1,
            pageSize: 100
        },
        schema: "v1",
        where: `collectionId=${collectionId}`
    });

    if (collectionAlreadyExists.length > 0) {
        console.log('collection already exists');
        return false;
    }


    await ctx.clients.masterdata.createDocument({
        dataEntity: 'collectionseller071',
        fields: {
            collectionId
        },
        schema: "v1"
    });

    return true;
}


export const removeCollection = async (
    _: any,
    { collectionId }: { collectionId: string },
    ctx: Context
) => {
    console.log('removeCollection resolver');

    const schema =  await ctx.clients.masterdata.getSchema({
        dataEntity: 'collectionseller071',
        schema: "v1"
    });

    if (!schema) {
        console.log('schema not found');
        return false;
    }

    const collectionOnDb = await ctx.clients.masterdata.searchDocuments<{
        collectionId: string;
        id: string;
    }>({
        dataEntity: 'collectionseller071',
        fields: ['collectionId', 'id'],
        pagination: {
            page: 1,
            pageSize: 100
        },
        schema: "v1",
        where: `collectionId=${collectionId}`
    });

    console.log(collectionOnDb, 'collectionOnDb')

    if (collectionOnDb.length === 0) {
        console.log('collection does not exists');
        return false;
    }

    await ctx.clients.masterdata.deleteDocument({
        dataEntity: 'collectionseller071',
        id: collectionOnDb[0].id
    });

    return true;
}