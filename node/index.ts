import type { ClientsConfig, ServiceContext } from '@vtex/api'
import { LRUCache, Service, method } from '@vtex/api'

import { Clients } from './clients'
import { addCollection, getCollections, removeCollection, sharedCollections, verify } from './resolvers'
import { Authenticate, addSellerProduct, getCollectionProducts, getCollectionsRoute, removeSellerProduct } from './middlewares'

const TIMEOUT_MS = 8000

// Create a LRU memory cache for the Status client.
// The 'max' parameter sets the size of the cache.
// The @vtex/api HttpClient respects Cache-Control headers and uses the provided cache.
// Note that the response from the API being called must include an 'etag' header
// or a 'cache-control' header with a 'max-age' value. If neither exist, the response will not be cached.
// To force responses to be cached, consider adding the `forceMaxAge` option to your client methods.
const memoryCache = new LRUCache<string, any>({ max: 5000 })

metrics.trackCache('status', memoryCache)

// This is the configuration for clients available in `ctx.clients`.
const clients: ClientsConfig<Clients> = {
  // We pass our custom implementation of the clients bag, containing the Status client.
  implementation: Clients,
  options: {
    // All IO Clients will be initialized with these options, unless otherwise specified.
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
    // This key will be merged with the default options and add this cache to our Status client.
    status: {
      memoryCache,
    },
  },
}

declare global {
  // We declare a global Context type just to avoid re-writing ServiceContext<Clients, State> in every handler and resolver
  type Context = ServiceContext<Clients>
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  routes: {
    // `status` is the route ID from service.json. It maps to an array of middlewares (or a single handler).
    AuthSeller: method({
      POST: [Authenticate, getCollectionsRoute]
    }),
    addProduct: method({
      POST: [addSellerProduct]
    }),
    productsInCollection: method({
      GET: [getCollectionProducts]
    }),
    "deleteProduct": method({
      POST: [removeSellerProduct]
    }),
  },
  graphql: {
    resolvers: {
      Query: {
        verify,
        sharedCollections,
        getCollections
      },
      Mutation: {
        addCollection(
          _: any,
          { collectionId }: { collectionId: string },
          ctx: Context
        ) {
          return addCollection(_, { collectionId }, ctx)
        },
        removeCollection(
          _: any,
          { collectionId }: { collectionId: string },
          ctx: Context
        ) {
          return removeCollection(_, { collectionId }, ctx)
        }
      }
    }
  }
})
