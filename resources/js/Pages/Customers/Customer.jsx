import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Messages from '../components/messages';
import { v4 as uuidv4 } from 'uuid';
import InvoicesList from "./InvoiceList";
// Import modern icons for Edit and Save
import { PencilSquareIcon, CheckCircleIcon } from "@heroicons/react/24/outline"; 

// A consistent, modern input style for Tailwind/Inertia
const inputClass = "w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-1.5 px-3";
const displayClass = "text-gray-700 dark:text-gray-300 text-sm py-1.5 px-3";
const labelClass = "text-gray-500 dark:text-gray-400 text-sm font-medium w-4/12 md:w-3/12 self-center";

// Helper component for a single editable field (improved markup)
const EditableField = ({ label, value, stateKey, isEditing, setEditState, setValue, updateField }) => {
    return (
        <div className="flex items-center justify-between w-full py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
            <span className={labelClass}>{label}</span>
            <div className="flex items-center w-8/12 md:w-9/12 ml-4">
                {isEditing ? (
                    <>
                        <input
                            className={`${inputClass} flex-1`}
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                        />
                        <CheckCircleIcon 
                            onClick={() => { setEditState(prev => ({ ...prev, [stateKey]: 0 })); updateField(); }}
                            className="w-5 h-5 ml-2 text-green-500 hover:text-green-700 cursor-pointer transition duration-150"
                            title="Save"
                        />
                    </>
                ) : (
                    <>
                        <p className={`flex-1 ${displayClass}`}>{value || '-'}</p>
                        <PencilSquareIcon 
                            onClick={() => { setEditState(prev => ({ ...prev, [stateKey]: 1 })); }}
                            className="w-5 h-5 ml-2 text-blue-500 hover:text-orange-500 cursor-pointer transition duration-150"
                            title="Edit"
                        />
                    </>
                )}
            </div>
        </div>
    );
};


export default function Settings({ auth, updateRoute, customer, invoices, updateInvoiceRoute }) {

    const [edit, setEdit] = useState({});
    const [messages, setMessages] = useState([]);
    const [sort, setSort] = useState({sortDirection:'up', sortName:'due'});

    // Customer Details
    const [name, setName] = useState(customer.name);
    const [nickname, setNickname] = useState(customer.nickname);
    const [code, setCode] = useState(customer.code);
    const [vat_code, setVatCode] = useState(customer.vat_code);
    const [website, setWebsite] = useState(customer.website);

    // Address Details
    const [street, setStreet] = useState(customer.street);
    const [city, setCity] = useState(customer.city);
    const [zip, setZip] = useState(customer.zip);
    const [country, setCountry] = useState(customer.country);

    // Contact Details
    const [cname, setCname] = useState(customer.contact_name);
    const [cphone, setCphone] = useState(customer.contact_phone);
    const [cemail, setCemail] = useState(customer.contact_email);

    // Notes
    const [company_notes, setCompanyNotes] = useState(customer.notes);

    const [invoicesList, setInvoicesList] = useState(invoices);

    // use efdetc for sort
    useEffect(()=>{
        invoicesList.forEach((item) => {
        const today = new Date();
        const invoiceDue = new Date(item.invoice_due_date);
        const maxDueDays = 1000;
        // Calculate due days. If paid, set to maxDueDays (large number for sorting).
        const due = !item.paid ? (invoiceDue - today)/ (1000 * 60 * 60 * 24) : maxDueDays;
        item.due = due;
        });
    },[invoicesList]);

    useEffect(()=>{
        // The array is shallow copied in sortInvoices, but React might warn about setting state
        // with the same array reference. Using the functional update here is safer.
        setInvoicesList(prevList => sortInvoices(prevList));
    },[sort]);

    const sortInvoices = (invoices) => {
        const sortedList = [...invoices];
        if (sort.sortDirection === 'up'){
            sortedList.sort((a,b)=>{
            if (typeof a[sort.sortName] === 'number' && typeof b[sort.sortName] === 'number'){
                return a[sort.sortName]- b[sort.sortName];
            } else if (a[sort.sortName] && b[sort.sortName]) {
                return a[sort.sortName].localeCompare(b[sort.sortName]);
            }
            return 0; // Fallback for null/undefined values
            });
        } else {
            sortedList.sort((a,b)=>{
            if (typeof a[sort.sortName] === 'number' && typeof b[sort.sortName] === 'number'){
                return b[sort.sortName]- a[sort.sortName];
            } else if (a[sort.sortName] && b[sort.sortName]) {
                return b[sort.sortName].localeCompare(a[sort.sortName]);
            }
            return 0; // Fallback for null/undefined values
            });
        }
        return sortedList;
    };

    const addMessage = (text, type) => {
        const uuid = uuidv4();
        const message = {
            text,
            type,
            uuid
        };
        // Use functional state update form
        setMessages(m => [message, ...m]);
        setTimeout(() => {
            setMessages(m => m.filter(msg => msg.uuid !== uuid));
        }, 1000);
    }

    const updateField = () => {
        console.log('letsupdate');
        const updatedFields = {
            'name': name,
            'nickname': nickname,
            'code': code,
            'vat_code': vat_code,
            'website': website,
            'street': street,
            'city': city,
            'zip': zip,
            'country': country,
            'contact_name': cname,
            'contact_phone': cphone,
            'contact_email': cemail,
            'notes': company_notes,
        }

        axios.post(updateRoute, { updatedFields })
            .then(res => {
                if (res.status === 201) {
                    addMessage(res.data.message, res.data.type);
                } else {
                    addMessage('Update failed (Status: ' + res.status + ')', 'danger');
                }
            })
            .catch(e => {
                console.error(e);
                addMessage('Request failed: Check console for details.', 'danger');
            }
            );
    }

    const doSort = n => {
        setSort(s => {
          switch (s.sortDirection) {
              case 'down': return {sortDirection:'up', sortName:n};
              case 'up': return {sortDirection:'down', sortName:n};
              default: return {sortDirection:'up', sortName:n}; // Added default case for safety
          }
        });
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                        Client: {customer.name}
                    </h2>
                    <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out">
                        <a href={route('invoices-create',[customer.id ])}>+ Add New Invoice</a>
                    </button>
                </div>
            }
        >
            <Head title="Client Info" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Customer Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-white dark:bg-gray-800 shadow-xl sm:rounded-lg">

                        {/* Customer Details Card */}
                        <div className="p-4 border-r dark:border-gray-700 md:border-r-2 md:border-b-0 border-b-2">
                            <h3 className="mb-4 text-xl font-bold text-blue-600 dark:text-blue-400 border-b pb-2 border-gray-200 dark:border-gray-700">Company Details</h3>
                            <EditableField label={"Client name:"} value={name} stateKey={'name'} isEditing={edit.name} setEditState={setEdit} setValue={setName} updateField={updateField} />
                            <EditableField label={"Nickname:"} value={nickname} stateKey={'nickname'} isEditing={edit.nickname} setEditState={setEdit} setValue={setNickname} updateField={updateField} />
                            <EditableField label={"Company code:"} value={code} stateKey={'code'} isEditing={edit.code} setEditState={setEdit} setValue={setCode} updateField={updateField} />
                            <EditableField label={"VAT code:"} value={vat_code} stateKey={'vat_code'} isEditing={edit.vat_code} setEditState={setEdit} setValue={setVatCode} updateField={updateField} />
                            <EditableField label={"Website:"} value={website} stateKey={'website'} isEditing={edit.website} setEditState={setEdit} setValue={setWebsite} updateField={updateField} />
                        </div>

                        {/* Address Details Card */}
                        <div className="p-4 border-r dark:border-gray-700 md:border-r-2 md:border-b-0 border-b-2">
                            <h3 className="mb-4 text-xl font-bold text-blue-600 dark:text-blue-400 border-b pb-2 border-gray-200 dark:border-gray-700">Address Details</h3>
                            <EditableField label={"Address:"} value={street} stateKey={'street'} isEditing={edit.street} setEditState={setEdit} setValue={setStreet} updateField={updateField} />
                            <EditableField label={"City:"} value={city} stateKey={'city'} isEditing={edit.city} setEditState={setEdit} setValue={setCity} updateField={updateField} />
                            <EditableField label={"Country:"} value={country} stateKey={'country'} isEditing={edit.country} setEditState={setEdit} setValue={setCountry} updateField={updateField} />
                            <EditableField label={"ZIP:"} value={zip} stateKey={'zip'} isEditing={edit.zip} setEditState={setEdit} setValue={setZip} updateField={updateField} />
                        </div>

                        {/* Contact Details Card */}
                        <div className="p-4">
                            <h3 className="mb-4 text-xl font-bold text-blue-600 dark:text-blue-400 border-b pb-2 border-gray-200 dark:border-gray-700">Primary Contact</h3>
                            <EditableField label={"Name:"} value={cname} stateKey={'cname'} isEditing={edit.cname} setEditState={setEdit} setValue={setCname} updateField={updateField} />
                            <EditableField label={"Phone:"} value={cphone} stateKey={'cphone'} isEditing={edit.cphone} setEditState={setEdit} setValue={setCphone} updateField={updateField} />
                            <EditableField label={"Email:"} value={cemail} stateKey={'cemail'} isEditing={edit.cemail} setEditState={setEdit} setValue={setCemail} updateField={updateField} />
                        </div>
                    </div>
                    
                    {/* Notes Section (Full Width) */}
                    <div className="mb-8 p-6 bg-white dark:bg-gray-800 shadow-xl sm:rounded-lg">
                        <h3 className="mb-4 text-xl font-bold text-blue-600 dark:text-blue-400 border-b pb-2 border-gray-200 dark:border-gray-700">Notes</h3>
                        <label className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2 block" htmlFor="note">Notes about this customer:</label>
                        <textarea 
                            className={`${inputClass} resize-y h-32`}
                            onBlur={() => { updateField(); }} // Call updateField when textarea loses focus
                            value={company_notes}
                            onChange={(event) => { setCompanyNotes(event.target.value); }}
                            id="note"
                            rows="8"
                        />
                    </div>
                    
                    {/* Invoices List Block */}
                    <div className="bg-white dark:bg-gray-800 shadow-xl sm:rounded-lg overflow-hidden">
                        <InvoicesList
                            invoicesList={invoicesList}
                            doSort={doSort}
                            setInvoicesList={setInvoicesList}
                            sortInvoices={sortInvoices}
                            updateInvoiceRoute={updateInvoiceRoute}
                            addMessage={addMessage}
                        />
                    </div>

                </div>
            </div>

            <Messages messages={messages} />
        </AuthenticatedLayout>
    );
}