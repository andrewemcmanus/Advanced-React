import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import SignOut from './SignOut';
import { useUser } from './User';
import { useCart } from '../lib/cartState';
// fix import
 
export default function Nav() {
    const user = useUser();
    const { openCart } = useCart();
    return (
        <NavStyles>
            <Link href="/products">Products</Link>
            {/* if there is a user (i.e. we're logged in) display these 3 Link tags... */}
            { user && (
                <>
                <Link href="/sell">Sell</Link>
                <Link href="/orders">Orders</Link>
                <Link href="/account">Account</Link>
                <SignOut />
                <button type="button" onClick={openCart}>My Cart</button>
                </>
            )}
            { !user && (
                <>
                <Link href="/signin">Sell</Link>
                </>
            )}
            
        </NavStyles>
    )
}