import { useEffect, useState } from "react";
import ModalYesCancel from '../components/modalYesCancel';
import Select from 'react-select';
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

// --- STYLE CONSTANTS ---
const inputClass = "w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-1.5 px-3";

export default function ProductsList({ products, setProducts, addMessage, allProducts, expenseTotal, setExpenseTotal, dropDownClassNames }) {

    // Removed unused modal state variables for cleaner code
    // const [modalStatus, setModalStatus] = useState(false);
    // const [modalItem, setModalItem] = useState('');
    // const [modalTitle, setModalTitle] = useState('');
    // const [modalMessage, setModalMessage] = useState('');
    // const [modalAction, setModalAction] = useState(null);

    const options = allProducts.map(product => {
        return ({ value: product.code, label: product.name })
    });

    useEffect(() => {
        totalSum();
    }, [products]);

    const totalSum = () => {
        const total = products.reduce((sum, product) => {
            return sum + (product[7] || 0); 
        }, 0);
        setExpenseTotal(total);
    };

    const handleProductChange = (productCode, id) => {
        const thisProduct = allProducts.find(product => product.code === productCode);
        if (!thisProduct) return;

        const editedProducts = products.map(product => {
            if (product[0] === id) {
                product[1] = thisProduct.id;
                product[2] = thisProduct.code;
                product[3] = thisProduct.name;
                product[4] = thisProduct.description;
                product[5] = thisProduct.price; 
                product[6] = 1; 
                product[7] = product[5] * product[6];
            }
            return product;
        });
        setProducts([...editedProducts]);
    };

    const handleRecordEdit = (e, recordID, recordIndex) => {
        let newValue = e.target.value;

        const editedProducts = products.map(product => {
            if (product[0] === recordID) {
                if (recordIndex === 5) {
                    // *** REPAIR: Remove .toFixed(2) in handleRecordEdit as well ***
                    // Parse the input value as a float
                    const currencyValue = parseFloat(newValue); 
                    // Convert currency value (e.g., 10.50) to cents (1050) for storage
                    newValue = (isNaN(currencyValue) ? 0 : currencyValue * 100);

                } else if (recordIndex === 6) {
                    // Quantity field (index 6): Ensure it's an integer
                    newValue = parseInt(newValue, 10);
                    if (isNaN(newValue) || newValue < 0) newValue = 0;
                }
                
                product[recordIndex] = newValue;
                product[7] = product[5] * product[6];
            }
            return product;
        });
        setProducts([...editedProducts]);
    };

    const handleAddProduct = () => {
        const largestID = products.reduce((largest, current) => {
            const itemId = current[0];
            return itemId > largest ? itemId : largest;
        }, 0);
        
        setProducts([...products, [largestID + 1, '', '', '', '', 0, 1, 0]]);
    };

    const handleRemoveProduct = (recordID) => {
        const filteredProducts = products.filter(p => {
            return p[0] !== recordID;
        });
        setProducts([...filteredProducts]);
    };

    // --- Select Component Styling for Dark Mode compatibility ---
    const customSelectStyles = {
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
            zIndex: 10,
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? 'rgb(31 41 55 / var(--tw-bg-opacity))' : state.isSelected ? 'rgb(59 130 246 / var(--tw-bg-opacity))' : 'rgb(55 65 81 / var(--tw-bg-opacity))',
            color: 'rgb(243 244 246 / var(--tw-text-opacity))',
        }),
        input: (base) => ({
            ...base,
            color: 'rgb(243 244 246 / var(--tw-text-opacity))',
        }),
    };
    
    // --------------------------------------------------------------------------

    return (
        <div className="w-full">
            <h3 className="p-6 text-xl font-bold text-blue-600 dark:text-blue-400 border-b border-gray-200 dark:border-gray-700">
                Expense Products and Services
            </h3>

            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
                
                {/* Table Header */}
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3 w-2/12" >
                            Product / Service
                        </th>
                        <th scope="col" className="px-6 py-3 w-4/12" >
                            Description
                        </th>
                        <th scope="col" className="px-6 py-3 w-1/12 text-center" >
                            Qty
                        </th>
                         <th scope="col" className="px-6 py-3 w-2/12 text-right">
                            Price (€)
                        </th>
                        <th scope="col" className="px-6 py-3 w-2/12 text-right" >
                            Total (€)
                        </th>
                        <th scope="col" className="px-6 py-3 w-1/12 text-center" >
                            Action
                        </th>
                    </tr>
                </thead>
                
                {/* Table Body - Product Rows */}
                <tbody>
                    {products.length ? (products.map((product) => {
                        if (!product || product.length < 8) return null; 

                        return (
                            <tr key={product[0]} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-150">
                                
                                {/* Product Select */}
                                <td scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <Select
                                        unstyled
                                        options={options}
                                        value={options.find(opt => opt.value === product[2]) || null}
                                        onChange={(selectedOption) => handleProductChange(selectedOption.value, product[0])}
                                        classNames={dropDownClassNames}
                                    />
                                </td>
                                
                                {/* Description Input (index 4) */}
                                <td className="px-4 py-3">
                                    <label className="sr-only" htmlFor={`productDescription-${product[0]}`}>Description</label>
                                    <textarea 
                                        rows="2"
                                        id={`productDescription-${product[0]}`} 
                                        value={product[4] || ''} 
                                        onChange={(e) => handleRecordEdit(e, product[0], 4)}
                                        className={`${inputClass} resize-y min-h-[40px]`}
                                    />
                                </td>
                                
                                {/* Quantity Input (index 6) */}
                                <td className={`px-4 py-3`}>
                                    <label className="sr-only" htmlFor={`productQuantity-${product[0]}`}>Quantity</label>
                                    <input
                                        type="number"
                                        min="1"
                                        id={`productQuantity-${product[0]}`}
                                        value={product[6] || 1}
                                        className={`${inputClass} text-center`}
                                        onChange={(e) => handleRecordEdit(e, product[0], 6)}
                                        onFocus={(e) => e.target.select()}
                                    />
                                </td>

                                {/* Price Input (index 5) - FIX APPLIED HERE */}
                                <td className={`px-4 py-3`}>
                                    <div className="relative">
                                        <label className="sr-only" htmlFor={`productPrice-${product[0]}`}>Price</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            id={`productPrice-${product[0]}`}
                                            // FIX: Removed .toFixed(2) so the user can freely type decimals
                                            value={product[5] / 100} 
                                            className={`${inputClass} pr-8 text-right`}
                                            onChange={(e) => handleRecordEdit(e, product[0], 5)}
                                            onFocus={(e) => e.target.select()}
                                        />
                                        <span className="pointer-events-none absolute inset-y-0 end-0 grid w-8 place-content-center text-gray-500 dark:text-gray-400"> € </span>
                                    </div>
                                </td>

                                
                                {/* Total Display (index 7) */}
                                <td className={`px-6 py-3 text-right font-semibold`}>
                                    {(product[7] / 100).toFixed(2)}{" €"}
                                </td>
                                
                                {/* Action Button */}
                                <td className={`px-4 py-3 text-center`}>
                                    <button
                                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600 transition duration-150"
                                        onClick={() => handleRemoveProduct(product[0])}
                                        title="Remove Product"
                                    >
                                        <TrashIcon className="w-5 h-5 mx-auto" />
                                    </button>
                                </td>

                            </tr>
                        )
                    })) : (
                        <tr>
                            <td colSpan="6" className="px-6 py-6 text-center text-base italic font-medium text-gray-500 dark:text-gray-400">
                                No products added to the expense. Click 'Add Product' below.
                            </td>
                        </tr>
                    )}

                </tbody>
                
                {/* Table Footer - Total and Add Button */}
                <tfoot>
                    <tr>
                        <td colSpan="3" className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border-t dark:border-gray-600">
                            <button 
                                className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-lg shadow-md flex items-center transition duration-150"
                                onClick={handleAddProduct}
                            >
                                <PlusIcon className="w-5 h-5 mr-2" /> Add New Product
                            </button>
                        </td>
                        
                        <td colSpan="3" className="px-6 py-4 text-right text-base font-bold bg-gray-100 dark:bg-gray-700 border-t dark:border-gray-600">
                            <div className="flex justify-end items-center">
                                <span className="text-gray-700 dark:text-gray-300 mr-4">INVOICE TOTAL:</span>
                                <span className="text-xl text-blue-600 dark:text-blue-400">
                                    {(expenseTotal / 100).toFixed(2)}{" €"}
                                </span>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>

            {/* Modal is kept here but is not used in this version */}
            <ModalYesCancel
                // modalItem={modalItem}
                // modalStatus={modalStatus}
                // setModalStatus={setModalStatus}
                // modalTitle={modalTitle}
                // modalMessage={modalMessage}
                // modalAction={modalAction}
            >
            </ModalYesCancel>
        </div>
    );
}