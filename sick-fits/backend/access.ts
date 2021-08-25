// Access functions: at its simplest, the access control returns a Yes or No value depending on the user's session

import { ListAccessArgs } from "./types";

export function isSignedIn({ session }: ListAccessArgs){
    return !!session; 
}