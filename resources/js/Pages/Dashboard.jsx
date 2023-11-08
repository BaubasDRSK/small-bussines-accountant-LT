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
    console.log(customerDashboard);
    axios.get(customerDashboard, {
    })
        .then(res => {
            if (res.status === 201) {
                // addMessage(res.data.message, res.data.type);
                // setInvoicesList(res.data.invoices);
                console.log(res.data);
                setTotalCustomers(res.data.totalCustomers);
            }
            else {
                addMessage('Something went wrong', 'danger');
            }
        }
        )
        .catch(e => {
            console.log(e);
        }
        );

    axios.get(invoiceDashboard, {
    })
        .then(res => {
            if (res.status === 201) {
                // addMessage(res.data.message, res.data.type);
                // setInvoicesList(res.data.invoices);
                console.log(res.data);
               setTotalSum(res.data.totalSales);
               setTotalOverdue(res.data.totalOverdue);
               setTotalSumThisMonth(res.data.totalSumThisMonth);
               setTotalInvoicesThisMonth(res.data.totalInvoicesThisMonth);
               setTotalDueThisMonth(res.data.totalDueThisMonth);
            }
            else {
                addMessage('Something went wrong', 'danger');
            }
        }
        )
        .catch(e => {
            console.log(e);
        }
        );
},[]);


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-100 leading-tight">Statistics</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">

                        {/* Bendra suvestine */}
                        <section className="bg-white">
                            <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
                                <div className="mx-auto max-w-3xl text-center">
                                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                                        Overall statistics
                                    </h2>

                                    <p className="mt-4 text-gray-500 sm:text-xl">
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione dolores
                                        laborum labore provident impedit esse recusandae facere libero harum
                                        sequi.
                                    </p>
                                </div>

                                <div className="mt-8 sm:mt-12">
                                    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                        <div className="flex flex-col rounded-lg bg-blue-100 px-4 py-8 text-center">
                                            <dt className="order-last text-lg font-medium text-gray-500">
                                                Total Sales
                                            </dt>

                                            <dd className="text-3xl font-extrabold text-blue-600 lg:text-5xl">
                                                €{(totalSum / 100).toFixed(2)}
                                            </dd>
                                        </div>

                                        <div className="flex flex-col rounded-lg bg-blue-100 px-4 py-8 text-center">
                                            <dt className="order-last text-lg font-medium text-gray-500">
                                                Total clients
                                            </dt>

                                            <dd className="text-3xl font-extrabold text-blue-600 lg:text-5xl">{totalCustomers}</dd>
                                        </div>

                                        <div className="flex flex-col rounded-lg bg-red-100 px-4 py-8 text-center">
                                            <dt className="order-last text-lg font-medium text-gray-500">
                                                Total overdue
                                            </dt>

                                            <dd className="text-3xl font-extrabold text-red-600 lg:text-5xl">€{(totalOverdue / 100).toFixed(2)}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </section>

                        {/* This month statistics */}
                        <section className="bg-white">
                            <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
                                <div className="mx-auto max-w-3xl text-center">
                                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                                        This month statistics
                                    </h2>

                                    <p className="mt-4 text-gray-500 sm:text-xl">
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione dolores
                                        laborum labore provident impedit esse recusandae facere libero harum
                                        sequi.
                                    </p>
                                </div>

                                <div className="mt-8 sm:mt-12">
                                    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                        <div className="flex flex-col rounded-lg bg-blue-100 px-4 py-8 text-center">
                                            <dt className="order-last text-lg font-medium text-gray-500">
                                                Total Sales this month
                                            </dt>

                                            <dd className="text-3xl font-extrabold text-blue-600 lg:text-5xl">
                                                €{(totalSumThisMonth / 100).toFixed(2)}
                                            </dd>
                                        </div>

                                        <div className="flex flex-col rounded-lg bg-blue-100 px-4 py-8 text-center">
                                            <dt className="order-last text-lg font-medium text-gray-500">
                                                Total invoices this month
                                            </dt>

                                            <dd className="text-3xl font-extrabold text-blue-600 lg:text-5xl">{totalInvoicesThisMonth}</dd>
                                        </div>

                                        <div className="flex flex-col rounded-lg bg-green-100 px-4 py-8 text-center">
                                            <dt className="order-last text-lg font-medium text-gray-500">
                                                Total due this month
                                            </dt>

                                            <dd className="text-3xl font-extrabold text-green-600 lg:text-5xl">€{(totalDueThisMonth / 100).toFixed(2)}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
