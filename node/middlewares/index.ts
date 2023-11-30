import { json } from 'co-body'

export async function Authenticate(ctx: Context, next: () => Promise<any>) {
  const body = await json(ctx.req);
  

  if (!body.sellerId) {
    ctx.status = 400
    ctx.body = {
      status: 'ERROR',
      message: 'Missing params'
    }

    return
  }

  const seller = await ctx.clients.catalog.seller(body.sellerId)

  if (!seller) {
        ctx.status = 404
        ctx.body = {
        status: 'ERROR',
        message: 'Seller not found'
        }
    
        return
   }

  await next()
}

export async function getCollectionsRoute(ctx: Context, next: () => Promise<any>) {
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

    if (!collections || collections === null) {
        ctx.status = 404
        ctx.body = {
        status: 'ERROR',
        message: 'Collections not found'
        }
    }

    let collectionsList: any = [];

    await Promise.all(collections.map(async (collection) => {
        const collectionData = await ctx.clients.vtex.getCollection(collection.collectionId);	

        if (!collectionData || collectionData === null) {
            ctx.status = 404
            ctx.body = {
            status: 'ERROR',
            message: 'Collection not found'
            }
        }

        collectionsList.push(collectionData);

        return;

    }));

  ctx.status = 200
  ctx.body = {
    status: 'OK',
    collectionsList
  }

  await next()
}


export async function addSellerProduct(ctx: Context, next: () => Promise<any>) {
    const body = await json(ctx.req);

    if (!body.sellerId || !body.skuId || !body.collectionId || !body.idType) {
        ctx.status = 400
        ctx.body = {
        status: 'ERROR',
        message: 'Missing params'
        }

        return
    }

    if (body.idType !== 'refId' && body.idType !== 'skuId') {
        ctx.status = 400
        ctx.body = {
        status: 'ERROR',
        message: 'Invalid idType'
        }

        return 
    }

    const seller = await ctx.clients.catalog.seller(body.sellerId)

    if (!seller) {
        ctx.status = 404
        ctx.body = {
        status: 'ERROR',
        message: 'Seller not found'
        }

        return
    }

    let product: any;

    if (body.idType === 'refId') {
        product = await ctx.clients.vtex.getSkuByRefId(body.skuId);
    } else {
        product = await ctx.clients.catalog.getSkuById(body.skuId);
    } 

    if (!product) {
        ctx.status = 404
        ctx.body = {
        status: 'ERROR',
        message: 'Product not found'
        }

        return
    }

    const subcollection = await ctx.clients.vtex.getSubCollection(body.collectionId);

    console.log(product.Id, 'product');
    const data = await ctx.clients.vtex.addProductToCollection(subcollection[0].Id, product.Id);

    ctx.status = 200
    ctx.body = {
        status: 'OK',
        message: 'Product added',
        data
    }

    await next()
}


export async function removeSellerProduct(ctx: Context, next: () => Promise<any>) {
    const body = await json(ctx.req);

    if (!body.sellerId || !body.skuId || !body.collectionId || !body.idType) {
        ctx.status = 400
        ctx.body = {
        status: 'ERROR',
        message: 'Missing params'
        }

        return
    }

    const seller = await ctx.clients.catalog.seller(body.sellerId)

    if (!seller) {
        ctx.status = 404
        ctx.body = {
        status: 'ERROR',
        message: 'Seller not found'
        }

        return
    }

    let product: any;

    if (body.idType === 'refId') {
        product = await ctx.clients.vtex.getSkuByRefId(body.skuId);
    } else {
        product = await ctx.clients.catalog.getSkuById(body.skuId);
    } 

    // const product = await ctx.clients.vtex.getSkuByRefId(body.skuId);

    console.log(product, 'product')

    const subcollection = await ctx.clients.vtex.getSubCollection(body.collectionId);

    await ctx.clients.vtex.removeProductFromCollection(subcollection[0].Id, product.Id);

    if (!product) {
        ctx.status = 404
        ctx.body = {
        status: 'ERROR',
        message: 'Product not found'
        }

        return
    }

    ctx.status = 200
    ctx.body = {
        status: 'OK',
        message: 'Product removed'
    }

    await next()
}


export async function getCollectionProducts(ctx: Context, next: () => Promise<any>) {
    const { collectionId } = ctx.query; 

    if (!collectionId) {
        ctx.status = 400
        ctx.body = {
        status: 'ERROR',
        message: 'Missing params'
        }

        return
    }

    const collection = await ctx.clients.vtex.getCollection(collectionId as string);

    if (!collection) {
        ctx.status = 404
        ctx.body = {
        status: 'ERROR',
        message: 'Collection not found'
        }

        return
    }

    const products = await ctx.clients.vtex.productsInCollection(collectionId as string);

    if (!products || products === null) {
        ctx.status = 404
        ctx.body = {
        status: 'ERROR',
        message: 'Products not found'
        }
    }

    ctx.status = 200
    ctx.body = {
        status: 'OK',
        products
    }

    await next()
}