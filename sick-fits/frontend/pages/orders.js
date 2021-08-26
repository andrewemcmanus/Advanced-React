import { useQuery } from "@apollo/client"
import gql from "graphql-tag"
import styled from "styled-components"
import ErrorMessage from '../components/ErrorMessage'
// import OrderStyles from '../components/styles/OrderStyles';
import formatMoney from "../lib/formatMoney"
import OrderItemStyles from '../components/styles/OrderItemStyles';
import Link from "next/dist/client/link";

const USER_ORDERS_QUERY = gql`
    query USER_ORDERS_QUERY($id: ID!) {
        allOrders: Order(where: { id: $id }) {
            id
            charge
            total
            user {
                id
            }
            items {
                id
                name
                description
                price
                photo {
                    image {
                        publicUrlTransformed
                    }
                }
            }
        } 
    }
`

const OrderUl = styled.ul`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    grid-gap: 4rem;
`

function countItemsInOrder(order) {
    return order.items.reduce((tally, item) => tally + item.quantity, 0);
}

export default function OrdersPage() {
    const { data, error, loading } = useQuery(USER_ORDERS_QUERY)
    if(loading) return <p>loading...</p>
    if(error) return <ErrorMessage error={error}></ErrorMessage>
    const { allOrders } = data;
    return (
        <div>
            <Head>
                <title>Your Orders({allOrders.length})</title>
            </Head>
            <h2>You have {allOrders.length} orders!</h2>
            <OrderUl>
                {allOrders.map(order => (
                    <OrderItemStyles>
                        <Link href={`/order/${order.id}`}>
                            <a>
                                <div className="order-meta">
                                    <p>
                                        {countItemsInOrder(order)}
                                        {order.items.length} Product{order.items.length === 1 ? '' : 's'}
                                    </p>
                                    <p>{formatMoney(order.total)}</p>
                                </div>
                                <div className="images">
                                    {order.items.map((item) => (<img key={`image-${item.id}`} src={item.photo.image.publicUrlTransformed} alt={item.name} />))}
                                </div>
                            </a>
                        </Link>

                    </OrderItemStyles>
                ))}
            </OrderUl>
        </div>
    )
}