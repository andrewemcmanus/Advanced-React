import { useMutation } from "@apollo/client";
import gql from "graphql-tag"
import { CURRENT_USER_QUERY } from "./User";

// endSession isn't a function in graphQL!
const SIGN_OUT_MUTATION = gql`
    mutation {
        endSession
    }
`;

export default function SignOut({ children }) {
    const [signout] = useMutation(SIGN_OUT_MUTATION, {
        refetchQueries: [{ query: CURRENT_USER_QUERY}]
    })
    return <button type="button" onClick={signout}>Sign Out</button>
}