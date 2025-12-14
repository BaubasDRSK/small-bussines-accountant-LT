import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Messages from './components/messages';
import { v4 as uuidv4 } from 'uuid';
import inputValidation from '../utilities/inputValidation.js';


export default function Settings({ auth, storeUrl, company }) {
    const [companyInfoServer, setCompanyInfoServer] = useState(company);
    const companyInfoKeys = Object.keys(companyInfoServer);
    const [companyInfo, setComp] = useState(companyInfoServer);
    const [messages, setMessages] = useState([]);
    const [validations, setValidations] = useState({});

    const handleUpdateValue = (key, newValue) => {
        setComp({
            ...companyInfo,
            [key]: newValue,
        });
    };

    const handleValidation = (key, value) => {
        const validationMsgs = inputValidation(key, value);
        setValidations({ ...validations, [validationMsgs[0]]: validationMsgs[1] });
    };

    // validations

    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

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
        }, 1500);
        // success warning danger
    }

    const store = () => {
        console.log('Store');

        axios.post(storeUrl, companyInfo)
            .then(res => {
                if (res.status === 201) {
                    setCompanyInfoServer({ ...companyInfo })
                    addMessage(res.data.message, res.data.type);
                    console.log('Urraaa');
                }
                else {

                }
            }
            )
            .catch(e => {
                console.log(e);
            }
            );
    }

    const cancel = () => {
        setComp({
            ...companyInfoServer,
        })
        addMessage('Data restored', 'warning');
        window.location.href = '/customers'; // Assuming you want to go back to customers page
    }

    // Determine if any value has changed to enable/disable buttons
    const isDirty = JSON.stringify(companyInfo) !== JSON.stringify(companyInfoServer);

    // Determine if there are any validation errors to disable save button
    const hasErrors = Object.values(validations).some(msgs => msgs.length > 0);


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                // Updated header styling to match the dashboard's header look
                <div className='flex justify-between items-center'>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        Settings
                    </h2>
                    {/* Action buttons moved to the header for consistency and quick access */}
                    <div className="flex space-x-3">
                        <button 
                            onClick={cancel} 
                            className={`py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out font-semibold ${
                                isDirty
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-gray-400 text-gray-600 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
                            }`}
                            disabled={!isDirty}
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={store} 
                            className={`py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out font-semibold ${
                                isDirty && !hasErrors
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-gray-400 text-gray-600 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
                            }`}
                            disabled={!isDirty || hasErrors}
                        >
                            Save
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Settings" />
            
            {/* Changed 'py-12' to 'py-10' and container classes */}
            <div className="py-10">
                {/* Adopted dashboard's max-width, centering, and padding classes */}
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">

                    {/* SETTINGS FORM SECTION */}
                    <section className="w-full max-w-full">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Company Settings
                            </h3>
                            <p className="mt-2 text-gray-500 dark:text-gray-400">
                                Update the core details, address, and contact information for your company.
                            </p>
                        </div>

                        {/* Updated container styling for a cleaner look and dark mode */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg border border-gray-200 dark:border-gray-700 p-6 md:p-8">
                            
                            <div className="sm:w-full md:w-8/12 lg:w-3/5 mx-auto">
                                
                                {/* Section: Company details */}
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                                    Company Details
                                </h3>
                                
                                {companyInfoKeys.map((key) => {
                                    const label = capitalizeFirstLetter(key.replace(/_/g, ' '));
                                    
                                    let sectionHeader = null;
                                    if (key === 'street') {
                                        sectionHeader = (
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4 mt-6">
                                                Address Details
                                            </h3>
                                        );
                                    } else if (key === 'phone') {
                                        sectionHeader = (
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4 mt-6">
                                                Contact Details
                                            </h3>
                                        );
                                    } else if (key === 'bank') {
                                        sectionHeader = (
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4 mt-6">
                                                Bank Details
                                            </h3>
                                        );
                                    }
                                    
                                    return (
                                        <div key={key}>
                                            {sectionHeader}
                                            <div className="mb-4">
                                                <label
                                                    htmlFor={key}
                                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                                >
                                                    {label}:
                                                </label>
                                                <input
                                                    id={key}
                                                    className="w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-300 dark:text-gray-200 focus:border-blue-500 focus:ring-blue-500 transition duration-150 ease-in-out text-sm"
                                                    type="text"
                                                    value={companyInfo[key]}
                                                    onChange={(e) => {
                                                        handleUpdateValue(key, e.target.value);
                                                        handleValidation(key, e.target.value);
                                                    }}
                                                />
                                                {/* validation alert */}
                                                {validations[key] ? (
                                                    <div className="mt-2">
                                                        {validations[key].length === 0 ? (
                                                            <div role="alert" className="rounded border-s-4 border-green-500 bg-green-50 dark:bg-green-900/50 p-2">
                                                                <p className="text-sm text-green-700 dark:text-green-300">
                                                                    Field info is correct
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <div role="alert" className="rounded border-s-4 border-red-500 bg-red-50 dark:bg-red-900/50 p-2">
                                                                {validations[key].map((msg) => (
                                                                    <p key={msg} className="text-sm text-red-700 dark:text-red-300">
                                                                        {msg}
                                                                    </p>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (null)}
                                                {/* validation alrt end */}
                                            </div>
                                        </div>
                                    )
                                })}

                                {/* Action buttons at the bottom of the card - kept for good UX when the header buttons are out of view */}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6 flex justify-center space-x-4">
                                    <button 
                                        onClick={store} 
                                        className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out ${
                                            !isDirty || hasErrors ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                        disabled={!isDirty || hasErrors}
                                    >
                                        Save Changes
                                    </button>
                                    <button 
                                        onClick={cancel} 
                                        className={`bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out ${
                                            !isDirty ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                        disabled={!isDirty}
                                    >
                                        Cancel Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <Messages
                messages={messages}
            />
        </AuthenticatedLayout>
    );
}

// ???