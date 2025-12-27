import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Messages from '../components/messages';
import { v4 as uuidv4 } from 'uuid';
import ProductsList from "./Products";
import Select from 'react-select';
import Datepicker from "react-tailwindcss-datepicker";
import { Page, Text, Document, PDFViewer, PDFDownloadLink, pdf } from '@react-pdf/renderer';
import Expensepdf from '../components/invoicePDF';
import saveAs from 'file-saver';
// 👇 ADDED IMPORTS FOR STYLE CONSISTENCY (Heroicons)
import { PencilSquareIcon, CheckCircleIcon } from "@heroicons/react/24/outline";


// --- STYLE CONSTANTS AND HELPER COMPONENT (Matching Customer Page Style) ---

// Consistent, modern input style for Tailwind/Inertia
const inputClass = "w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-1.5 px-3";
const displayClass = "text-gray-700 dark:text-gray-300 text-sm py-1.5 px-3";
// Adjusted label width to maintain alignment in the two-column grid
const labelClass = "text-gray-500 dark:text-gray-400 text-sm font-medium w-4/12 md:w-3/12 self-center min-w-[100px]";

/**
 * Helper component for a single editable field (Refactored from Customer page)
 * @param {string} label - The display label.
 * @param {string} value - The current value.
 * @param {string} stateKey - The key in the 'edit' state object.
 * @param {boolean} isEditing - Current editing status for this field.
 * @param {function} setEditState - Setter for the global 'edit' state.
 * @param {function} setValue - Custom setter for the field's value (handles array update for customer fields).
 * @param {function} updateField - Function to save the changes (e.g., calling handelSaveExpense).
 */
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
                            value={value || ''}
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

// -------------------------------------------------------------------------


export default function Expense({ auth, updateRoute, expense, updateExpenseRoute, allProducts, allCustomers, storeRoute, company }) {
    console.log(expense);
    // Initialize state with props or defaults
    const [thisExpense, setThisExpense] = useState(expense ?? null);
    const [expenseDate, setExpenseDate] = useState({
        startDate: expense?.expense_date ? new Date(expense.expense_date) : new Date(),
        endDate: expense?.expense_date ? new Date(expense.expense_date) : new Date()
    });

    const [downloaded, setDownloaded] = useState(false);

    const [expenseDueDate, setExpenseDueDate] = useState({
        startDate: expense?.expense_due_date ? new Date(expense.expense_due_date) : new Date(),
        endDate: expense?.expense_due_date ? new Date(expense.expense_due_date) : new Date()
    });
    const [expenseNotes, setExpenseNotes] = useState(expense.notes ?? '');
    const [paid, setPaid] = useState(expense.paid ?? false);
    const [expenseTotal, setExpenseTotal] = useState(expense.total ?? 0);
    const [expenseTitle, setExpenseTitle] = useState(expense.name ?? '');
    const [expenseNumber, setExpenseNumber] = useState(expense.expense_number ?? '');

    const [edit, setEdit] = useState({});
    const [messages, setMessages] = useState([]);
    const [sort, setSort] = useState({ sortDirection: 'up', sortName: 'due' });
    // [0:id, 1:name, 2:code, 3:vat, 4:street, 5:city, 6:country, 7:zip]
    const [customer, setCustomer] = useState(expense.customer ?? []);
    // [recodrID ,id, code, name, description, price, quantity, total]
    const [products, setProducts] = useState(expense.products ?? []);

    const customersOptions = allCustomers.map(customer => {
        return ({ value: customer.id, label: customer.name })
    });

    // Helper function to update a specific index in the customer array
    const setCustomerField = (index) => (value) => {
        setCustomer(prevCustomer => {
            const newCustomer = [...prevCustomer];
            newCustomer[index] = value;
            return newCustomer;
        });
    };

    const handleCustomerChange = (customerID) => {
        const thisCustomer = allCustomers.find(customer => customer.id === customerID);
        if (!thisCustomer) return;

        // Map customer object fields to the expected customer array structure
        const newCustomer = [];
        newCustomer[0] = thisCustomer['id'];
        newCustomer[1] = thisCustomer['name'];
        newCustomer[2] = thisCustomer['code'];
        newCustomer[3] = thisCustomer['vat_code'];
        newCustomer[4] = thisCustomer['street'];
        newCustomer[5] = thisCustomer['city'];
        newCustomer[6] = thisCustomer['country'];
        newCustomer[7] = thisCustomer['zip'];
        setCustomer([...newCustomer]);
    };

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
        // success warning danger < is messeages type :)
    }

    const handleExpenseDateChange = (date) => {
        setExpenseDate(date);
    };

    const handleExpenseDueDateChange = (date) => {
        setExpenseDueDate(date);
    };
    
    // Function to handle saving changes to the expense
    const handelSaveExpense = () => {
        const fullExpense = thisExpense;
            console.log(fullExpense);
        axios.post(updateExpenseRoute, { fullExpense })
            .then(res => {
                if (res.status === 200 || res.status === 201) {
                    addMessage(res.data.message, res.data.type);
                }
            })
            .catch(e => {
                console.error("Error saving expense:", e);
                addMessage('Failed to save expense.', 'danger');
            });
    };
    
    // Re-use save function for field updates
    // const updateField = handelSaveExpense;
    const updateField = () => {
        console.log("aaa aaaa");
    }

    const handelStoreExpense = () => {
        const fullExpense = thisExpense;

        axios.post(storeRoute, { fullExpense })
            .then(res => {
                if (res.status === 201) {
                    addMessage(res.data.message, res.data.type);
                    // Redirect to the newly created expense page
                    window.location.href = '/expenses/show/' + res.data.expense;
                }
            })
            .catch(e => {
                console.error("Error storing expense:", e);
                addMessage('Failed to create new expense.', 'danger');
            });
    };

    // Effect to update the complete thisExpense object whenever dependencies change
    useEffect(() => {
        // Create a new object or deep copy if you plan to avoid state mutation warnings
        const fullExpense = { ...thisExpense }; 
        
        fullExpense['name'] = expenseTitle;
        fullExpense['expense_number'] = expenseNumber;
        fullExpense['expense_date'] = expenseDate.startDate;
        fullExpense['expense_due_date'] = expenseDueDate.startDate;
        fullExpense['notes'] = expenseNotes;
        fullExpense['paid'] = paid ? 1 : 0; // Ensure consistency
        fullExpense['customer_id'] = customer[0];
        fullExpense['customer'] = customer;
        fullExpense['products'] = products;
        fullExpense['total'] = expenseTotal;
        
        setThisExpense(fullExpense);

    }, [
        expenseDate,
        expenseNumber,
        expenseDueDate,
        expenseNotes,
        paid,
        customer,
        products,
        expenseTotal,
        expenseTitle,
    ]);

    // PDF Download logic
    const [pdfBlob, setPdfBlob] = useState(null);

    useEffect(() => {
        if (pdfBlob && !downloaded) {
            // Use setTimeout to ensure the browser has time to prepare
            setTimeout(() => {
                 pdfBlob.toBlob((blob) => {
                     const url = URL.createObjectURL(blob);
                     const a = document.createElement('a');
                     a.href = url;
                     a.download = `expense-${thisExpense.expense_number}.pdf`;
                     document.body.appendChild(a); // Append link to body
                     a.click();
                     document.body.removeChild(a); // Clean up
                     URL.revokeObjectURL(url); // Release object URL
                     setDownloaded(true);
                 });
            }, 100);
        }
    }, [pdfBlob, thisExpense.expense_number, downloaded]);

    // const handleDownloadPdf = () => {
    //     handelSaveExpense();
    //     setDownloaded(false); // Reset the downloaded state
    //     const pdfPromise = pdf(<Expensepdf expense={thisExpense} company={company} />);
    //     setPdfBlob(pdfPromise);
    // };

    const handleDownloadPdf = async () => {
        setDownloaded(false);
        
        // 1. Create the PDF instance
        const doc = <Expensepdf expense={thisExpense} company={company} />;
        
        // 2. Generate the blob
        const blob = await pdf(doc).toBlob();
        
        // 3. Trigger the download (using file-saver or a manual link)
        saveAs(blob, `Expense_${thisExpense.expense_number}.pdf`);
        
        setDownloaded(true);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                        {thisExpense.expense_number ? `Expense #${thisExpense.expense_number} Details` : 'New Expense'}
                    </h2>
                </div>
            }
        >
            <Head title="Expense Details" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* ACTION BUTTONS (TOP) */}
                    <div className="flex justify-end p-4 bg-gray-50 dark:bg-gray-700 sm:rounded-lg mb-6 shadow-md">
                        <button
                            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out mr-4"
                            onClick={() => { window.location.href = '/expenses'; }}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out mr-4"
                            onClick={() => thisExpense.id ? handelSaveExpense() : handelStoreExpense()}
                        >
                            Save Expense
                        </button>
                        {thisExpense.expense_number ?
                            <button
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out"
                                onClick={handleDownloadPdf}
                                disabled={pdfBlob && !downloaded}
                            >
                                {pdfBlob && !downloaded ? 'Generating PDF...' : 'Download PDF'}
                            </button>
                            : null}
                    </div>

                    {/* Expense Meta and Dates Section */}
                    <div className="bg-white dark:bg-gray-800 shadow-xl sm:rounded-lg p-6 mb-8">
                        <h3 className="mb-4 text-xl font-bold text-blue-600 dark:text-blue-400 border-b pb-2 border-gray-200 dark:border-gray-700">Expense Status & Dates</h3>
                        
                        <div className="flex items-center w-full py-2 border-b border-gray-100 dark:border-gray-700">
                            <h2 className={labelClass}>Invoice number:</h2>
                            <input 
                                type="text" 
                                className={`${inputClass} w-full ml-4`}
                                onChange={(e) => { setExpenseNumber(e.target.value); }}
                                onBlur={updateField}
                                value={expenseNumber} 
                            />
                        </div>
                        {/* Expense Title (Full Width Field) */}
                        <div className="flex items-center w-full py-2 border-b border-gray-100 dark:border-gray-700">
                            <h2 className={labelClass}>Expense Title:</h2>
                            <input 
                                type="text" 
                                className={`${inputClass} w-full ml-4`}
                                onChange={(e) => { setExpenseTitle(e.target.value); }}
                                onBlur={updateField}
                                value={expenseTitle} 
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                            {/* Paid Status (Checkbox) */}
                            <div className='flex items-center py-2'>
                                <h2 className="text-gray-500 dark:text-gray-400 text-sm font-medium mr-4">Expense Paid:</h2>
                                <input 
                                    type="checkbox" 
                                    className='w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                                    onChange={() => setPaid(p => (p === 1 ? 0 : 1))}                                
                                    id="paidStatus" 
                                    name="paidStatus" 
                                    checked={paid === 1} 
                                />
                            </div>

                            {/* Expense Date */}
                            <div className='py-2'>
                                <h2 className="mb-1 text-gray-500 dark:text-gray-400 text-sm font-medium">Expense Date:</h2>
                                <Datepicker
                                    inputClassName={inputClass}
                                    containerClassName="w-full relative"
                                    asSingle={true}
                                    value={expenseDate}
                                    onChange={handleExpenseDateChange}
                                />
                            </div>

                            {/* Expense Due Date */}
                            <div className='py-2'>
                                <h2 className="mb-1 text-gray-500 dark:text-gray-400 text-sm font-medium">Expense Due Date:</h2>
                                <Datepicker
                                    inputClassName={inputClass}
                                    containerClassName="w-full relative"
                                    asSingle={true}
                                    value={expenseDueDate}
                                    onChange={handleExpenseDueDateChange}
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Customer Selection and Details Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 p-6 bg-white dark:bg-gray-800 shadow-xl sm:rounded-lg">
                        
                        {/* Customer Selection and Details Card (Left side) */}
                        <div className="p-4 lg:border-r dark:border-gray-700 lg:border-b-0 border-b pb-8 lg:pb-4">
                            <h3 className="mb-4 text-xl font-bold text-blue-600 dark:text-blue-400 border-b pb-2 border-gray-200 dark:border-gray-700">Client Selection & ID</h3>
                            
                            <div className="mb-4">
                                <label className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1 block">Select customer for expense:</label>
                                <Select
                                    options={customersOptions}
                                    value={{ value: customer[0], label: customer[1] }}
                                    onChange={(selectedOption) => handleCustomerChange(selectedOption.value)}
                                    // Use custom styles to ensure compatibility with dark mode
                                    styles={{
                                        control: (base, state) => ({
                                            ...base,
                                            backgroundColor: 'rgb(55 65 81 / var(--tw-bg-opacity))',
                                            borderColor: state.isFocused ? 'rgb(59 130 246 / var(--tw-border-opacity))' : 'rgb(75 85 99 / var(--tw-border-opacity))',
                                            minHeight: '38px',
                                            boxShadow: state.isFocused ? '0 0 0 1px rgb(59 130 246 / var(--tw-ring-opacity))' : 'none',
                                        }),
                                        singleValue: (base) => ({
                                            ...base,
                                            color: 'rgb(243 244 246 / var(--tw-text-opacity))',
                                        }),
                                        menu: (base) => ({
                                            ...base,
                                            backgroundColor: 'rgb(55 65 81 / var(--tw-bg-opacity))',
                                        }),
                                        option: (base, state) => ({
                                            ...base,
                                            backgroundColor: state.isFocused ? 'rgb(31 41 55 / var(--tw-bg-opacity))' : state.isSelected ? 'rgb(59 130 246 / var(--tw-bg-opacity))' : 'rgb(55 65 81 / var(--tw-bg-opacity))',
                                            color: 'rgb(243 244 246 / var(--tw-text-opacity))',
                                        }),
                                    }}
                                />
                            </div>
                            
                            {/* Editable Fields for Customer ID Data */}
                            <EditableField label={"Company name:"} value={customer[1]} stateKey={'name'} isEditing={edit.name} setEditState={setEdit} setValue={setCustomerField(1)} updateField={updateField} />
                            <EditableField label={"Company code:"} value={customer[2]} stateKey={'code'} isEditing={edit.code} setEditState={setEdit} setValue={setCustomerField(2)} updateField={updateField} />
                            <EditableField label={"VAT code:"} value={customer[3]} stateKey={'vat_code'} isEditing={edit.vat_code} setEditState={setEdit} setValue={setCustomerField(3)} updateField={updateField} />
                            
                        </div>

                        {/* Address Details Card (Right side) */}
                        <div className="p-4">
                            <h3 className="mb-4 text-xl font-bold text-blue-600 dark:text-blue-400 border-b pb-2 border-gray-200 dark:border-gray-700">Address Details</h3>
                            
                            {/* Editable Fields for Customer Address Data */}
                            <EditableField label={"Street (house, flat):"} value={customer[4]} stateKey={'street'} isEditing={edit.street} setEditState={setEdit} setValue={setCustomerField(4)} updateField={updateField} />
                            <EditableField label={"City:"} value={customer[5]} stateKey={'city'} isEditing={edit.city} setEditState={setEdit} setValue={setCustomerField(5)} updateField={updateField} />
                            <EditableField label={"Country:"} value={customer[6]} stateKey={'country'} isEditing={edit.country} setEditState={setEdit} setValue={setCustomerField(6)} updateField={updateField} />
                            <EditableField label={"ZIP:"} value={customer[7]} stateKey={'zip'} isEditing={edit.zip} setEditState={setEdit} setValue={setCustomerField(7)} updateField={updateField} />
                        </div>
                        
                    </div>
                    
                    {/* Notes Section */}
                    <div className="mb-8 p-6 bg-white dark:bg-gray-800 shadow-xl sm:rounded-lg">
                        <h3 className="mb-4 text-xl font-bold text-blue-600 dark:text-blue-400 border-b pb-2 border-gray-200 dark:border-gray-700">Notes</h3>
                        <label className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2 block" htmlFor="note">Expense Notes:</label>
                        <textarea 
                            className={`${inputClass} resize-y h-32`}
                            onBlur={updateField} // Trigger save on blur
                            value={expenseNotes}
                            onChange={(event) => { setExpenseNotes(event.target.value); }}
                            id="note"
                            rows="8"
                        />
                    </div>
                    
                    {/* Products List Block */}
                    <div className="bg-white dark:bg-gray-800 shadow-xl sm:rounded-lg overflow-hidden mb-8">
                        <ProductsList
                            products={products}
                            setProducts={setProducts}
                            allProducts={allProducts}
                            expenseTotal={expenseTotal}
                            setExpenseTotal={setExpenseTotal}
                        />
                    </div>

                    {/* ACTION BUTTONS (BOTTOM) */}
                    <div className="flex justify-end p-4 bg-gray-50 dark:bg-gray-700 sm:rounded-lg shadow-md">
                        <button
                            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out mr-4"
                            onClick={() => { window.location.href = '/expenses'; }}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out mr-4"
                            onClick={() => thisExpense.id ? handelSaveExpense() : handelStoreExpense()}
                        >
                            Save Expense
                        </button>
                        {thisExpense.expense_number ?
                            <button
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out"
                                onClick={handleDownloadPdf}
                                disabled={pdfBlob && !downloaded}
                            >
                                {pdfBlob && !downloaded ? 'Generating PDF...' : 'Download PDF'}
                            </button>
                            : null}
                    </div>

                </div>
            </div>

            <Messages messages={messages} />
        </AuthenticatedLayout>
    );
}