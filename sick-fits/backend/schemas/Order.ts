import { list } from '@keystone-next/keystone/schema';
import { integer, select, text, relationship, virtual } from '@keystone-next/fields'
import formatMoney from '../lib/formatMoney'
import { isSignedIn, rules } from '../access';

export const Order = list({
    access: {
        create: isSignedIn,
        read: rules.canOrder,
        update: () => false,
        delete: () => false,

    },
    fields: {
        // CUSTOM LABEL:
        label: virtual({
            graphQLReturnType: 'String',
            resolver: function(item) {
                return `These shoes are ${formatMoney(item.total)} let's get em`;
            },
        }),
        total: integer(),
        items: relationship({ ref: 'OrderItem.order', many: true }),
        user: relationship({ ref: 'User.orders' }),
        charge: text(),
    },
})