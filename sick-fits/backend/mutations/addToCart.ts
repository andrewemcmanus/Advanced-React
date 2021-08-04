import { KeystoneContext, SessionStore } from "@keystone-next/types";
import { CartItemCreateInput } from '../.keystone/schema-types'
import { Session } from "../types";

export default async function addToCart(
    root: any, 
    { productId }: { productId: string }, 
    context: KeystoneContext
): Promise<CartItemCreateInput> {
    // console.log('Adding to cart')
    // 1. query the current user, see if they're signed in
    const sesh = context.session as Session;
    
    if(!sesh.itemId) {
        throw new Error('You must be logged in to do this!')
    }
    // 2. query the current user's cart
    const allCartItems = await context.lists.CartItem.findMany({
        where: { user: { id: sesh.itemId }, product: { id: productId }},
        resolveField: 'id, quantity'

    });
    const { existingCartItem } = allCartItems;

    // 3. see if the current item is in their cart...
    if(existingCartItem) {
        console.log(`There are already ${existingCartItem.quantity}, increment by 1`)

        // 4. if it is, increment by 1
        return await context.lists.CartItem.updateOne({
            id: existingCartItem.id,
            data: { quantity: existingCartItem.quantity + 1 }
        })
    };
    
    // 5. if it isn't, create a new cart item
    return await context.lists.CartItem.createOne({
        data: {
            product: { connect: { id: productId }},
            user: { connect: { id: sesh.itemId }},
        }
    })
}