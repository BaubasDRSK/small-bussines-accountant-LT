import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { useState } from "react";
import Messages from './components/messages';
import { v4 as uuidv4 } from 'uuid';

// ------------------------------------------------------------------
// ** SOLUTION: MOVE InputField OUTSIDE the main component **
// ------------------------------------------------------------------

/**
 * Helper component for rendering input fields
 */
const InputField = ({ label, id, value, onChange, isTextArea = false }) => {
    const inputClasses = "mt-1 block w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150 ease-in-out";
    
    // Note: The onChange handler uses the provided 'id' and 'e.target.value'
    // to correctly update the specific field in the parent state.
    const handleChange = (e) => onChange(id, e.target.value);
    
    return (
        <div className='my-4'>
            <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
                {label}
            </label>
            {isTextArea ? (
                <textarea
                    id={id}
                    rows="4"
                    className={`${inputClasses} resize-none`}
                    value={value}
                    onChange={handleChange}
                ></textarea>
            ) : (
                <input
                    id={id}
                    type="text"
                    className={inputClasses}
                    value={value}
                    onChange={handleChange}
                />
            )}
        </div>
    );
};

// ------------------------------------------------------------------
// ** The main component **
// ------------------------------------------------------------------

export default function Settings({ auth, storeRoute }) {
    // ... (rest of your component logic remains here)
    const [messages, setMessages] = useState([]);

    const companyDetails = [['name', 'Company name (Required)'], ['nickname', 'Company nickname (Brand, optional)'], ['code', 'Company Reg. Code'], ['vat_code', 'Company VAT Code (If applicable)']];
    const companyAddress = [['street', 'Street, House, Flat'], ['city', 'City'], ['country', 'Country'], ['zip', 'Postal Code']];
    const companyContact = [['contact_name', 'Primary Contact Name'], ['contact_phone', 'Primary Contact Phone'], ['contact_email', 'Primary Contact Email'], ['website', 'Company Website']];

    const initialClientState = {
        name: '',
        nickname: '',
        code: '',
        vat_code: '',
        street: '',
        city: '',
        country: '',
        zip: '',
        contact_name: '',
        contact_phone: '',
        contact_email: '',
        website: '',
        notes: ''
    };

    const [newClient, setNewClient] = useState(initialClientState);

    // ... (rest of addMessage, handleUpdateValue, and store functions)

    const addMessage = (text, type) => {
        const uuid = uuidv4();
        const message = {
            text,
            type,
            uuid
        };
        setMessages(m => [message, ...m]);
        setTimeout(() => {
            setMessages(m => m.filter(m => m.uuid !== uuid));
        }, 3000);
    }

    const handleUpdateValue = (key, newValue) => {
        setNewClient(prevClient => ({
            ...prevClient,
            [key]: newValue,
        }));
    };

    const store = () => {
        if (!newClient.name) {
            addMessage('Company name is required!', 'danger');
            return;
        }

        axios.post(storeRoute, { newClient })
            .then(res => {
                if (res.status === 201) {
                    addMessage(res.data.message || 'Client created successfully!', 'success');
                    localStorage.setItem('searchName', newClient['name']);
                    if (res.data.route) {
                        window.location.href = res.data.route;
                    } else {
                        window.location.href = route('customers-index');
                    }
                }
            })
            .catch(error => {
                console.error('Client creation failed:', error);
                const errorMessage = error.response?.data?.message || 'An error occurred during client creation.';
                addMessage(errorMessage, 'danger');
            });
    };

    return (
        // ... (your JSX rendering)
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        New Client
                    </h2>
                    <div className="flex gap-3">
                        <button 
                            onClick={store}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out"
                        >
                            Save Client
                        </button>
                        <a 
                            href={route('customers-index')} 
                            className="inline-flex items-center bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out"
                        >
                            Cancel
                        </a>
                    </div>
                </div>
            }
        >
            <Head title="New Client" />
            
            <div className="py-10">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
                    <div className="bg-white dark:bg-gray-800 shadow-xl sm:rounded-lg p-6 lg:p-8">
                        
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-2 dark:border-gray-700">
                            Client Details
                        </h3>

                        <div className="flex flex-col md:flex-row flex-wrap gap-x-8 gap-y-6 justify-between w-full">
                            
                            {/* === Column 1: Company Details === */}
                            <div className='w-full md:w-[calc(33%-1rem)] min-w-[300px]'>
                                <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">
                                    General Information
                                </h4>
                                {companyDetails.map((item) => (
                                    <InputField
                                        key={item[0]}
                                        id={item[0]}
                                        label={item[1]}
                                        value={newClient[item[0]]}
                                        onChange={handleUpdateValue}
                                    />
                                ))}
                            </div>

                            {/* === Column 2: Address Details === */}
                            <div className='w-full md:w-[calc(33%-1rem)] min-w-[300px]'>
                                <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">
                                    Address
                                </h4>
                                {companyAddress.map((item) => (
                                    <InputField
                                        key={item[0]}
                                        id={item[0]}
                                        label={item[1]}
                                        value={newClient[item[0]]}
                                        onChange={handleUpdateValue}
                                    />
                                ))}
                            </div>

                            {/* === Column 3: Contact Details === */}
                            <div className='w-full md:w-[calc(33%-1rem)] min-w-[300px]'>
                                <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">
                                    Contact Information
                                </h4>
                                {companyContact.map((item) => (
                                    <InputField
                                        key={item[0]}
                                        id={item[0]}
                                        label={item[1]}
                                        value={newClient[item[0]]}
                                        onChange={handleUpdateValue}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* === Notes Section (Full Width) === */}
                        <div className='w-full mt-6 pt-4 border-t dark:border-gray-700'>
                            <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">
                                Internal Notes
                            </h4>
                            <InputField
                                id="notes"
                                label="Notes about client:"
                                value={newClient.notes}
                                onChange={handleUpdateValue}
                                isTextArea={true}
                            />
                        </div>

                        {/* === Bottom Action Buttons === */}
                        <div className='flex justify-start gap-4 mt-6'>
                            <button
                                onClick={store}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition duration-150 ease-in-out"
                            >
                                Save Client
                            </button>
                            <a
                                href={route('customers-index')}
                                className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition duration-150 ease-in-out"
                            >
                                Cancel
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
            <Messages
                messages={messages}
            />
        </AuthenticatedLayout>
    );
}