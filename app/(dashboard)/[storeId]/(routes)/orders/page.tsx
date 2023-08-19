import prismadb from "@/lib/prismadb";
import { OrdersClient } from "./components/client";
import { OrdersColumn } from "./components/columns";
import { format } from "date-fns";
import { formatter } from "@/lib/utils";

const OrdersPage = async ({
    params
}: {
    params: { storeId: string }
}) => {
    const orders = await prismadb.order.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedOrders: OrdersColumn[] = orders.map(item => ({
        id: item.id,
        name: item.name,
        email: item.email,
        phone: item.address,
        address: item.address,
        products: item.orderItems.map(orderItem => orderItem.product.name).join(", "),
        totalPrice: formatter.format(item.orderItems.reduce((total, item) => {
            return total + Number(item.product.price)
        }, 0)),
        isPaid: item.isPaid,
        createdAt: format(item.createdAt, "do MMMM, yyyy")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <OrdersClient data={formattedOrders} />
            </div>
        </div>
    );
};

export default OrdersPage;