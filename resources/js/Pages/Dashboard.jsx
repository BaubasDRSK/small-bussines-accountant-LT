import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from "axios";
import { useEffect, useState } from "react";
import Messages from './components/messages';

export default function Dashboard({ auth, customerDashboard, invoiceDashboard }) {

    const [totalSum, setTotalSum] = useState(0);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [totalOverdue, setTotalOverdue] = useState(0);
    const [totalSumThisMonth, setTotalSumThisMonth] = useState(0);
    const [totalInvoicesThisMonth, setTotalInvoicesThisMonth] = useState(0);
    const [totalDueThisMonth, setTotalDueThisMonth] = useState(0);

    useEffect(() => {
        axios.get(customerDashboard)
            .then(res => {
                if (res.status === 201) {
                    setTotalCustomers(res.data.totalCustomers);
                }
            })
            .catch(console.log);

        axios.get(invoiceDashboard)
            .then(res => {
                if (res.status === 201) {
                    setTotalSum(res.data.totalSales);
                    setTotalOverdue(res.data.totalOverdue);
                    setTotalSumThisMonth(res.data.totalSumThisMonth);
                    setTotalInvoicesThisMonth(res.data.totalInvoicesThisMonth);
                    setTotalDueThisMonth(res.data.totalDueThisMonth);
                }
            })
            .catch(console.log);
    }, []);

    const StatCard = ({ title, value, color }) => (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition hover:shadow-md">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {title}
            </dt>
            <dd className={`mt-2 text-3xl font-bold ${color}`}>
                {value}
            </dd>
        </div>
    );

    return (
    <AuthenticatedLayout
        user={auth.user}
        header={
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Dashboard statistics
            </h2>
        }
    >
        <Head title="Dashboard" />

        <div className="py-10">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 space-y-16">

                {/* OVERALL STATISTICS */}
                <section className="w-full max-w-full px-4">
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Overall statistics
                        </h3>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">
                        Summary of all-time business performance
                        </p>
                    </div>

                    <dl className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6 w-full">
                        <StatCard
                        title="Total Sales"
                        value={`€${(totalSum / 100).toFixed(2)}`}
                        color="text-blue-600 dark:text-blue-400"
                        />
                        <StatCard
                        title="Total Clients"
                        value={totalCustomers}
                        color="text-indigo-600 dark:text-indigo-400"
                        />
                        <StatCard
                        title="Total Overdue"
                        value={`€${(totalOverdue / 100).toFixed(2)}`}
                        color="text-red-600 dark:text-red-400"
                        />
                    </dl>
                </section>
                {/* THIS MONTH STATISTICS */}
                <section className="w-full max-w-full px-4">
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        This month
                        </h3>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">
                            Current month financial overview
                        </p>
                    </div>

                    <dl className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6 w-full">
                        <StatCard
                            title="Sales this month"
                            value={`€${(totalSumThisMonth / 100).toFixed(2)}`}
                            color="text-blue-600 dark:text-blue-400"
                        />
                        <StatCard
                            title="Invoices this month"
                            value={totalInvoicesThisMonth}
                            color="text-purple-600 dark:text-purple-400"
                        />
                        <StatCard
                            title="Due this month"
                            value={`€${(totalDueThisMonth / 100).toFixed(2)}`}
                            color="text-green-600 dark:text-green-400"
                        />
                    </dl>
                </section>
            </div>
        </div>
    </AuthenticatedLayout>
);

}
