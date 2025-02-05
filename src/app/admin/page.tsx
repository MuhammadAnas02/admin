"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { client } from "@/sanity/lib/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Component to display orders graph using Recharts
function OrdersGraph({ orders }) {
  // Group orders by formatted date (e.g. "MM/DD/YYYY")
  const ordersByDate = orders.reduce((acc, order) => {
    const date = new Date(order._createdAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  // Convert to array of objects for Recharts
  const data = Object.keys(ordersByDate)
    .sort((a, b) => new Date(a) - new Date(b))
    .map((date) => ({
      date,
      orders: ordersByDate[date],
    }));

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Orders Graph</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="orders" fill="#4ade80" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const query = `*[_type == 'order'] | order(_createdAt desc) {
      _id,
      name,
      email,
      phone,
      totalPrice,
      cartItems[] {
        _key,
        title,
        quantity,
        price,
        image
      },
      _createdAt
    }`;
    
    try {
      const data = await client.fetch(query);
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    
    try {
      const response = await fetch("/api/deleteOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setOrders(orders.filter((order) => order._id !== id));
      } else {
        alert("Failed to delete order");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting order");
    }
  };

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (acc, order) => acc + (order.totalPrice || 0),
    0
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orders Dashboard</h1>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Order
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalOrders}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(totalRevenue)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Order List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="min-w-full divide-y divide-gray-200">
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white divide-y divide-gray-200">
              {orders.map((order, idx) => (
                <TableRow
                  key={order._id}
                  className={`hover:bg-gray-50 transition-colors ${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order._createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.name}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.email}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.phone}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${order.totalPrice?.toFixed(2)}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.cartItems?.map((item) => (
                      <div key={item._key}>
                        {item.title} x {item.quantity} (${item.price?.toFixed(2)})
                      </div>
                    ))}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(order._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <OrdersGraph orders={orders} />
    </div>
  );
}
