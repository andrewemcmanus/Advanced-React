// import Page from '../components/Page';
// No need to wrap everything in Page tag because of _app.js
import CreateProduct from "../components/CreateProduct";
import PleaseSignIn from "../components/PleaseSignIn";

// Gated PleaseSignIn component: prevents components from displaying
// "return children" allows this
export default function SellPage() {
    return (
            <div>
                <PleaseSignIn>
                    <CreateProduct />
                </PleaseSignIn>
            </div>
        )
}