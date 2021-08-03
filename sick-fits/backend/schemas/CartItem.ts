import { list } from '@keystone-next/keystone/schema'
import { integer, select, text, relationship } from '@keystone-next/fields'

export const CartItem = list({
    ui: {
        listView: {
            initialColumns: ['product', 'quantity', 'user']
        }
    }
    fields: {
        quantity: integer({
            defaultValue: 1,
            isRequired: true,
        }),
        product: relationship({ ref: 'Product' }),
        // two way relationship with User
        user: relationship({ ref: 'User.cart' }),
    },
});