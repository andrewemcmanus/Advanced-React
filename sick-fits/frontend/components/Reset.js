import Form from "./styles/Form"
import useForm from "../lib/useForm"
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { CURRENT_USER_QUERY } from "./User";
import Error from './ErrorMessage'

const RESET_MUTATION = gql`
    mutation RESET_MUTATION($email: String!, $password: String!, $token: String!) {
        redeemUserPasswordResetToken(
            email: $email
            password: $password 
            token: $token
        ) {
            code
            message
        }
    }
`;

export default function Reset({ token }) {
    const { inputs, handleChange, resetForm } = useForm({
        email: '',
        password: '',
        token,
    });

    const [reset, { data, loading, error }] = useMutation(RESET_MUTATION, {
        variables: inputs,
    })
    const sucessfulError = data?.redeemUserPasswordResetToken?.code ? data?.redeemUserPasswordResetToken : undefined;
// change error definition here
    async function handleSubmit(e) {
        e.preventDefault(); // stop the form from submitting
        // send the email and password to the graphQL API
        const res = await reset().catch(console.error);
        resetForm();
    }

    return (
    <Form method="POST" onSubmit={handleSubmit}>
        <h2>Reset your password</h2>
        <Error error={error || successfulError} />
        <fieldset>
            {data?.redeemUserPasswordResetToken === null && <p>Success! You can now sign in.</p>}
            <label htmlFor="email">
            Email
            <input 
                type="email" 
                name="email"
                placeholder="email address"
                autoComplete="email" 
                value={inputs.email}
                onChange={handleChange}
            /> 
            </label>
            <label htmlFor="password">
                Password
                <input 
                    type="password"
                    name="password"
                    placeholder="password"
                    autoComplete="password"
                    value={inputs.password}
                    onChange={handleChange}
                />
            </label>
            <button type="submit">Request Reset</button>
        </fieldset>
    </Form>
    )
    
}