import { useEffect, useState } from "react";
import ModalYesCancel from '../components/modalYesCancel';
import Select from 'react-select';

export default function ProductsList({ products, setProducts, addMessage, allProducts, invoiceTotal, setInvoiceTotal }) {

    const [modalStatus, setModalStatus] = useState(false);
    const [modalItem, setModalItem] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalAction, setModalAction] = useState(null);

    const options = allProducts.map(product => {
        return({value: product.code, label: product.name})});

        useEffect(() => {
            totalSum(); // Calculate the invoice total first
            console.log(products);
            console.log(invoiceTotal); // Then log the invoice total
        }, [products]);

        const totalSum = () => {
            const total = products.reduce((sum, product) => {
                return sum + product[7];
            }, 0);
            console.log(total);
            setInvoiceTotal(total);
        };

    const handleProductChange= (productCode,id) => {
    const thisProduct = allProducts.filter(product => product.code === productCode );
    const editedProducts = products.map(product => {
        if (product[0] === id) {
            product[0] = id;
            product[1] = thisProduct[0]['id'];
            product[2] = thisProduct[0]['code'];
            product[3] = thisProduct[0]['name'];
            product[4] = thisProduct[0]['description'];
            product[5] = thisProduct[0]['price'];
            product[6] = 1;
            product[7] = product[6] * product[5];
        }
        return product;
    });
    setProducts([...editedProducts]);
    };

    const handleRecordEdit =  (e, recordID, recordIndex ) => {
    const editedProducts = products.map(product => {
        let newValue = e.target.value;
        if (product[0] === recordID) {
            if (recordIndex === 5) {
                newValue =newValue * 100;
            }

            product[recordIndex] = newValue;
            product[7] = product[5] * product[6];
        }
        return product;
    });
    setProducts([...editedProducts]);
    };

    // const handlePaidStatusChange = (invoice,) => {
    //     invoice.paid = invoice.paid ? 0 : 1;
    //     const updatedInvoicesList = invoicesList.map(item => {
    //         if (item.id === invoice.id) {
    //             item.paid = invoice.paid;
    //             return item;
    //         }
    //         return item;
    //     });

    //     setInvoicesList(updatedInvoicesList);
    //     axios.post(updateInvoiceRoute, { invoice: invoice.id, paid: invoice.paid })
    //         .then(res => {
    //             if (res.status === 201) {
    //                 addMessage(res.data.message, res.data.type);
    //                 localStorage.setItem('searchName', newClient['name']);
    //                 window.location.href = res.data.route;
    //             }
    //             else {

    //             }
    //         }
    //         )
    //         .catch(e => {
    //             console.log(e);
    //         }
    //         );
    // };


    const searchInvoices = () => {
        const searchedList = [...invoicesFullList];
        const filteredList = !search.length ? [...invoicesFullList] : searchedList.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

        setInvoicesList(sortInvoices(filteredList));
    };

    return (
        <div className="max-w-7xl mx-auto mt-3 py-4 sm:px-6 lg:px-8 flex flex-wrap justify-items-center bg-gray-200">
            <h2 className="mb-4 text-lg font-bold text-blue-600">Invoice products and services</h2>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3" >
                            <p className="text-m">Product:</p>

                        </th>
                        <th scope="col" className="px-6 py-3" >
                            Name (Description)
                        </th>
                        <th scope="col" className="px-6 py-3" >
                            Price
                        </th>
                        <th scope="col" className="px-6 py-3" >
                            Quantity
                        </th>
                        <th scope="col" className="px-6 py-3" >
                            Total
                        </th>
                        <th scope="col" className="px-6 py-3" >
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {products.length ? (products.map((product) => {

                        return (

                            <tr key={product[0]} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <Select
                                        options={options}
                                        value={{value: product[2], label: product[3]}}
                                        onChange={(selectedOption)=> handleProductChange(selectedOption.value ,product[0])}
                                    />
                                </td>
                                <td className="px-6 py-4 ">
                                    <label className="hidden" htmlFor="productName"></label>
                                    <input type="text" id="productName" value = {product[4]} onChange = {(e)=> handleRecordEdit(e, product[0], 4) }/>
                                </td>
                                <td className={`px-6 py-4 relative`}>
                                    <label className="hidden" htmlFor="productPrice"></label>
                                    <input
                                        type="number"
                                        id="productPrice"
                                        value = {product[5] / 100}
                                        className="w-full rounded-md border-gray-200 pe-7 shadow-sm sm:text-sm"
                                        onChange = {(e)=> handleRecordEdit(e, product[0], 5) }
                                    />
                                        <span className="pointer-events-none absolute inset-y-0 end-5 grid w-10 place-content-center text-gray-800"> € </span>
                                </td>
                                <td className={`px-6 py-4`}>
                                <label className="hidden" htmlFor="productQuantity"></label>
                                    <input
                                        type="number"
                                        id="productQuantity"
                                        value = {product[6]}
                                        className="w-full rounded-md border-gray-200 pe-7 shadow-sm sm:text-sm"
                                        onChange = {(e)=> handleRecordEdit(e, product[0], 6) }
                                    />
                                </td>
                                <td className={`px-6 py-4`}>
                                    {(product[7] / 100).toFixed(2)}{" €"}
                                </td>
                                <td className={`px-6 py-4`}>
                                    <button
                                        className= "text-red-500 w-8 h-8 rounded-full flex items-center justify-center  hover:text-red-700"
                                        onClick={() => {
                                            const filteredProducts = products.filter(p => {
                                                return p[0] !== product[0];
                                            });
                                            setProducts([...filteredProducts]);
                                        }}
                                    >
                                        <span className="text-md font-bold">X</span>
                                    </button>
                                </td>

                            </tr>

                        )
                    })) : (
                        <tr>
                            <td colSpan="5" className="px-6 py-4 text-center text-sm font-medium text-gray-900 dark:text-gray-300">Add products</td>
                        </tr>
                    )}

                </tbody>
            </table>
            <div className="flex justify-end py-3 pr-4  w-full bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <button className="bg-green-500 text-white hover:bg-green-600 hover:text-white px-4 py-2 rounded-md flex items-center"
                    onClick={() => {
                        const newID = products.reduce((largest, current) => {
                            const itemId = current[0];
                            return itemId > largest ? itemId : largest;
                          }, 0);
                        setProducts([...products, [newID+1, '', '', '', '', '', '', '']]);
                    }}
                >
                    <span className="text-lg font-bold mr-2">+</span> Add New Product
                </button>
            </div>
            <ModalYesCancel
                modalItem={modalItem}
                modalStatus={modalStatus}
                setModalStatus={setModalStatus}
                modalTitle={modalTitle}
                modalMessage={modalMessage}
                modalAction={modalAction}
            >
            </ModalYesCancel>
        </div>

    )
}
