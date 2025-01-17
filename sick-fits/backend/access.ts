// Access functions: at its simplest, the access control returns a Yes or No value depending on the user's session
import { permissionsList } from "./schemas/fields";
import { ListAccessArgs } from "./types";
// !! = true boolean?
export function isSignedIn({ session }: ListAccessArgs){
    return !!session; 
}

const generatedPermissions = Object.fromEntries(
    permissionsList.map((permission) => [
            permission,
            function({ session }: ListAccessArgs) {
                return !!session?.data.role?.[permission];
            },
        ])
    );
// Permissions: check if someone meets a criteria: yes or no
export const permissions = {
    ...generatedPermissions,

};
// RULE-BASED FUNCTIONS
// Rules can return a boolean - yes or no - or a filter which limits which products they can CRUD.
export const rules = {
    canManageProducts({ session }: ListAccessArgs) {
        if (!isSignedIn({session})) {
            return false;
        }
        // 1. Do they have the canManageProucts permission?
        if (permissions.canManageProducts({ session })) {
            return true;
        }
        // 2. If not, do they own this item?
        return { user: { id: session.itemId }};
    },
    canOrder({ session }: ListAccessArgs) {
        if (!isSignedIn({ session })) {
            return false;
        }
        if (permissions.canManageCart({ session })) {
            return true;
        }
        return { user: { id: session.itemId }};

    },
    canManageOrderItems({ session }: ListAccessArgs) {
        if (!isSignedIn({ session })) {
            return false;
        }
        if (permissions.canManageCart({ session })) {
            return true;
        }
        return { order: { user: { id: session.itemId } } }
    },
    canReadProducts({ session }: ListAccessArgs) {
        if (!isSignedIn({ session })) {
            return false;
        }
        if (permissions.canManageProducts({ session })) {
            return true;
        }
        // binds as a where clause in graphQL API to only show products that are available
        return { status: 'AVAILABLE' }
    },
    canManageUsers({ session }: ListAccessArgs ) {
        if (!isSignedIn({ session })) {
            return false;
        }
        if (permissions.canManageUsers({ session })) {
            return true;
        }
        // otherwise they may only update themselves
        return { id: session.itemId };
    },
}