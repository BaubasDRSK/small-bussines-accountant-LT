import { useEffect, useState } from "react";
import ModalYesCancel from '../components/modalYesCancel';
import Select from 'react-select';
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

// --- STYLE CONSTANTS ---
const inputClass = "w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-1.5 px-3";

export default function ProductsList({ products, setProducts, addMessage, allProducts, invoiceTotal, setInvoiceTotal, dropDownClassNames }) {

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
        setInvoiceTotal(total);
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
             {/* Title */}
             <h3 className="p-6 text-base md:text-lg font-bold text-blue-600 dark:text-blue-400 border-b">
                Invoice Products and Services
            </h3>

            {/* Header (Desktop Only) */}
            <div className="hidden md:grid grid-cols-[2fr_4fr_1fr_2fr_2fr_1fr] gap-2 px-6 py-3 text-xs uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <div>Product / Service</div>
                <div>Description</div>
                <div className="text-center">Qty</div>
                <div className="text-right">Price (€)</div>
                <div className="text-right">Total (€)</div>
                <div className="text-center">Action</div>
            </div>

            {/* Rows */}
            <div className="divide-y dark:divide-gray-700">

                {products.length ? (
                products.map((product) => {
                    if (!product || product.length < 8) return null

                    return (
                    <div
                        key={product[0]}
                        className="grid md:grid-cols-[2fr_4fr_1fr_2fr_2fr_1fr] gap-4 px-4 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                    >

                        {/* Product */}
                        <div>
                        <span className="md:hidden text-xs text-gray-500">Product</span>
                        <Select
                            unstyled
                            options={options}
                            value={options.find(opt => opt.value === product[2]) || null}
                            onChange={(opt) => handleProductChange(opt.value, product[0])}
                            classNames={dropDownClassNames}
                        />
                        </div>

                        {/* Description */}
                        <div>
                        <span className="md:hidden text-xs text-gray-500">Description</span>
                        <textarea
                            rows="2"
                            value={product[4] || ''}
                            onChange={(e) => handleRecordEdit(e, product[0], 4)}
                            className={`${inputClass} resize-y`}
                        />
                        </div>

                        {/* Quantity */}
                        <div>
                        <span className="md:hidden text-xs text-gray-500">Qty</span>
                        <input
                            type="number"
                            min="1"
                            value={product[6] || 1}
                            className={`${inputClass} text-center`}
                            onChange={(e) => handleRecordEdit(e, product[0], 6)}
                            onFocus={(e) => e.target.select()}
                        />
                        </div>

                        {/* Price */}
                        <div>
                        <span className="md:hidden text-xs text-gray-500">Price (€)</span>
                        <input
                            type="number"
                            step="0.01"
                            value={product[5] / 100}
                            className={`${inputClass} text-right`}
                            onChange={(e) => handleRecordEdit(e, product[0], 5)}
                            onFocus={(e) => e.target.select()}
                        />
                        </div>

                        {/* Total */}
                        <div className="font-semibold text-right text-black dark:text-white">
                        <span className="md:hidden text-xs text-black dark:text-white block">Total (€)</span>
                        {(product[7] / 100).toFixed(2)} €
                        </div>

                        {/* Action */}
                        <div className="flex justify-end md:justify-center items-center">
                        <button
                            onClick={() => handleRemoveProduct(product[0])}
                            className="text-red-500 hover:text-red-700 dark:text-red-400"
                            title="Remove Product"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                        </div>

                    </div>
                    )
                })
                ) : (
                <div className="px-6 py-6 text-center text-base italic font-medium text-gray-500 dark:text-gray-400">
                    No products added to the invoice. Click 'Add Product' below.
                </div>
                )}

            </div>

            {/* Footer */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 py-4 bg-gray-100 dark:bg-gray-700 border-t dark:border-gray-600">

                <button
                onClick={handleAddProduct}
                className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-lg shadow-md flex items-center transition"
                >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add New Product
                </button>

                <div className="flex items-center text-base font-bold">
                <span className="mr-4 text-gray-700 dark:text-gray-300">
                    INVOICE TOTAL:
                </span>
                <span className="text-xl text-blue-600 dark:text-blue-400">
                    {(invoiceTotal / 100).toFixed(2)} €
                </span>
                </div>

            </div>

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