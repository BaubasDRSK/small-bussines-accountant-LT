import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Messages from './components/messages';
import { v4 as uuidv4 } from 'uuid';


export default function Settings({ auth }) {
    const [messages, setMessages] = useState([]);

    const companyDetails = [['name','Company name'], ['nickname','Company nickname (brand etc)'], ['code','Company reg. code'], ['vat_code', 'Company VAT code (if any)'] ];
    const companyAddress = [['street','Street, house, flat..'], ['city', 'City'], ['country','Country'], ['zip','Postal code']];
    const companyContact = ['contact_name', 'contact_phone', 'contact-email', 'website' ];
    const companyNotes = ['notes'];
    // const companyBank = ['bank_name', 'bank_account_number', 'bank_swift_code' ];

     return (
        <AuthenticatedLayout
            user={auth.user}
            header={
               <div className='flex justify-between gap-4' >
                    <h2 className=" flex-1 text-2xl leading-tight font-bold text-blue-500 dark:bg-gray-800 w-auto">
                        New Client
                    </h2>
                    <button className=" w-auto bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">
                        <a href={route('dashboard')}>Save</a>
                    </button>
                    <button className=" w-auto bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
                        <a href={route('customers-index')}>Cancle</a>
                    </button>
                </div>
            }
        >
            <Head title="New Client" />
            <div className="py-12 ">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <div className="flex justify-center items-end dark:bg-gray-800 dark:text-gray-400">
                            <div className="flex gap-7 justify-center w-full sm:bg-red-100 md:bg-red-300 lg:bg-red-600 xl:bg-red-800">
                                <div className='min-w-300 flex-col'>
                                    {companyDetails.map((item) =>(
                                        <div key={item[0]} className='my-4'>
                                            <label
                                                htmlFor={item[0]}
                                                className="block text-gray-600  dark:text-gray-400 font-bold mb-1 "
                                            >
                                                {item[1]}:
                                            </label>
                                            <input
                                                id={item[0]}
                                                className="px-4 py-2 border border-gray-300  dark:bg-gray-600 rounded w-full mb-4"
                                                type="text"
                                                value={''}
                                                // onChange={(e) => handleUpdateValue(key, e.target.value)}
                                            />
                                        </div>
                                    ))}
                                    </div>
                                    <div className='min-w-300 flex-col'>
                                     {companyAddress.map((item) =>(
                                        <div key={item[0]} className='my-4'>
                                            <label
                                                htmlFor={item[0]}
                                                className="block text-gray-600  dark:text-gray-400 font-bold mb-1 "
                                            >
                                                {item[1]}:
                                            </label>
                                            <input
                                                id={item[0]}
                                                className="px-4 py-2 border border-gray-300  dark:bg-gray-600 rounded w-full mb-4"
                                                type="text"
                                                value={''}
                                                // onChange={(e) => handleUpdateValue(key, e.target.value)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                <Messages
                    const messages = {messages}
                />
        </AuthenticatedLayout>
    );
}
