import 'dotenv/config';
import { config, createSchema } from '@keystone-next/keystone/schema';
import { createAuth } from '@keystone-next/auth';
import { User } from './schemas/User';
import { Role } from './schemas/Role';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';
import { CartItem } from './schemas/CartItem';
import { OrderItem } from './schemas/OrderItem';
import { Order } from './schemas/Order';
import { withItemData, statelessSessions } from '@keystone-next/keystone/session'
import { insertSeedData } from './seed-data';
import { sendPasswordResetEmail } from './lib/mail';
import { extendGraphqlSchema } from './mutations';
import { permissionsList } from './schemas/fields';

const databaseURL = process.env.DATABASE_URL || 'mongodb://localhost/keystone-sick-fits-tutorial';

const sessionConfig = {
    maxAge: 60 * 60 * 24 * 360, // how long to stay signed in
    secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
    listKey: 'User',
    identityField: 'email',
    secretField: 'password',
    initFirstItem: {
        fields: ['name', 'email', 'password'],
        // TODO: add initial roles here
    },
    passwordResetLink: {
        async sendToken(args) {
            // send the email
            await sendPasswordResetEmail(args.token, args.identity);
            
        }

    }
});

export default withAuth(
    config({
    server: {
        cors: {
            origin: [process.env.FRONTEND_URL],
            credentials: true,
        },
        
    },
    db: {
        adapter: 'mongoose',
        url: databaseURL,
        async onConnect(keystone) {
            console.log('Connected to the database!');
            if(process.argv.includes('--seed-data')) {
                await insertSeedData(keystone);
            }
        },
    },
    lists: createSchema({
        // Schema items go in here
        User,
        Product,
        ProductImage,
        CartItem,
        OrderItem,
        Order,
        Role, 
    }),
    extendGraphqlSchema,
    ui: {
        // show the UI only for people who pass this test:
        isAccessAllowed: ({ session }) => {
            console.log(session);
            return !!session?.data;
        },
    },
    session: withItemData(statelessSessions(sessionConfig), {
        // GraphQL Query: interpolate a list of permissions from fields.ts (e.g. canManageCart)
        User: `id name email role { ${permissionsList.join(' ')} }`
    })
    // TODO: add session values here
    })
);