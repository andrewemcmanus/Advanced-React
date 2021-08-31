import { relationship, text } from "@keystone-next/fields";
import { list } from "@keystone-next/keystone/schema";
import { permissions } from "../access";
import { permissionFields } from "./fields";

// ROLES-BASED PERMISSION
export const Role = list({
    access: {
        create: permissions.canManageRoles,
        read: permissions.canManageRoles,
        update: permissions.canManageRoles,
        delete: permissions.canManageRoles,
    },
    // adjust UI for particular roles:
    ui: {
        hideCreate: (args) => !permissions.canManageRoles(args),
        hideDelete: (args) => !permissions.canManageRoles(args),
        isHidden: (args) => !permissions.canManageRoles(args),
    },
    fields: {
        name: text({ isRequired: true }),
        ...permissionFields,
        assignedTo: relationship({
            ref: 'User.role', // TODO: add this to the User
            many: true,
            ui: {
                itemView: { fieldMode: 'read' },
            }
        })

    }
})