import { list } from '@keystone-next/keystone/schema';
import { text, password, relationship } from '@keystone-next/fields';
import { permissions, rules } from '../access';

export const User = list({
    access: {
        create: () => true,
        read: rules.canManageUsers,
        update: rules.canManageUsers,
        delete: permissions.canManageUsers,
    },
    ui: {
        // hide the backend UI from regular users
        hideCreate: (args) => !permissions.canManageUsers(args),
        hideDelete: (args) => !permissions.canManageUsers(args),

    },
    fields: {
        name: text({ isRequired: true }),
        email: text({ isRequired: true, isUnique: true }),
        password: password(),
        cart: relationship({
            // two way relationship with CartItem
            ref: 'CartItem.user',
            many: true,
            ui: {
                createView: { fieldMode: 'hidden' },
                itemView: { fieldMode: 'read' },
            }
        }),
    orders: relationship({ ref: 'Order.user', many: true }),
    // control access of the *relationship* as well
    role: relationship({ 
        ref: 'Role.assignedTo',
        access: {
            create: permissions.canManageUsers,
            update: permissions.canManageUsers,
        }
    }),
    products: relationship({
        ref: 'Product.user',
        many: true,
    }),
    },
});