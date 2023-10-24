import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'


export default class Vtex extends ExternalClient {
    constructor(context: IOContext, options?: InstanceOptions) {
        super(`http://${context.account}.vtexcommercestable.com.br`, context, options)
    }

    public async createEntity(): Promise<any> {
        try {
            const res = await this.http.put(`/api/dataentities/collectionseller070/schemas/v1`, {
                "properties": {
                    "collectionId": {
                        "type": "string"
                    },
                },
                "v-indexed": [
                    "collectionId"
                ],
                "v-security": {
                    "allowGetAll": true,
                    "publicRead": [
                        "collectionId"
                    ],
                    "publicWrite": [
                        "collectionId"
                    ],
                    "publicFilter": [
                        "collectionId"
                    ]
                },
                "v-cache": false
            }, {
                headers: {
                    'X-Vtex-Use-Https': 'true',
                    'Proxy-Authorization': this.context.adminUserAuthToken || this.context.authToken,
                    'VtexIdClientAutCookie': this.context.adminUserAuthToken || this.context.authToken,
                },
            })

            console.log(res, 'res vtex')

            return res;
        } catch (error) {
            console.log(error, 'error vtex')
            return error
        }
    }

    public async testToken(): Promise<any> {
        console.log(this.context.adminUserAuthToken, 'this.context.admin')
    }

    // public async sendEmail(message: string): Promise<string> {
    //   return this.http.post('/send', { message })
    // }

    public async getCollections(): Promise<any> {
        const data = await this.http.get(`/api/catalog_system/pvt/collection/search?page=1&pageSize=100&orderByAsc=true`, {
            headers: {
                'X-Vtex-Use-Https': 'true',
                'Proxy-Authorization': this.context.adminUserAuthToken || this.context.authToken,
                'VtexIdClientAutCookie': this.context.adminUserAuthToken || this.context.authToken,
            }
        });

        

        return data;
    }



}
