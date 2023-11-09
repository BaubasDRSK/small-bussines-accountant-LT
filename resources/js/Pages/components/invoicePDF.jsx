import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import openSans from './OpenSans.ttf';


Font.register({
    family: 'openSans',
    fonts: [
        {
            src: openSans
        }
    ]
});

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        padding: 20,
        paddingTop: 25,
        fontFamily: 'openSans',
    },
    image: {
        width: 48,
        height: 48,
        marginBottom: 20,

    },
    header: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        backgroundColor: '#D4F0FF',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    addressContainer: {
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    address: {
        fontSize: 10,
        marginBottom: 5,
    },
    section: {
        marginBottom: 20,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    value: {
        fontSize: 10,
    },
    table: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#333',
        borderStyle: 'solid',
        marginBottom: 20,
        fontSize: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#333',
        color: '#fff',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        borderBottomStyle: 'solid',
        paddingVertical: 10,
    },
    tableCell: {
        width: '20%',
        paddingLeft: 8,
    },
    total: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 20,
    },
    footer: {
        marginTop: 20,
        fontSize: 10,
    },
});

const invoiceData = {
    invoiceDate: '2023 15 15',
    invoiceNumber: 'PRS-10221',
    clientDetails: 'Client',
    issueWithDetails: 'Company',
    products: [
        {
            name: 'Product 1',
            price: 10.00,
            qty: 5,
        },
        {
            name: 'Product 2',
            price: 15.00,
            qty: 3,
        },
        {
            name: 'Product 3',
            price: 20.00,
            qty: 2,
        },

    ],
    total: 180,
    invoiceNotes: 'notes',
    footer: 'footer',
}

const formatDate = (date) => {
    if (!date) return ''; // Handle cases where date is undefined or null

    const formattedDate = new Date(date);

    if (isNaN(formattedDate)) return ''; // Handle cases where date is not a valid date

    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
    const day = String(formattedDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};


const Invoicepdf = ({ invoice, company }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Image style={styles.image} src='http://accountant.fun/img/logo.png' />
                <View style={styles.header}>
                    <Text style={styles.title}>Invoice {invoice.invoice_number} </Text>
                    <View style={styles.addressContainer}>
                        <Text style={styles.address}>{company.name}</Text>
                        <Text style={styles.address}>Code: {company.code} / VAT code:{company.vat_code}</Text>
                        <Text style={styles.address}>{company.street}, {company.city}, {company.country} </Text>
                        <Text style={styles.address}>{company.phone}, {company.email}</Text>
                        <Text style={styles.address}>{company.web}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Bill To:</Text>
                    <Text style={styles.value}>
                        <Text style={{ color: '#666' }}>Company:</Text> {invoice.customer[1]}
                    </Text>
                    <Text style={styles.value}>
                        <Text style={{ color: '#666' }}>Code:</Text> {invoice.customer[2]}
                    </Text>
                    <Text style={styles.value}>
                        <Text style={{ color: '#666' }}>VAT:</Text> {invoice.customer[3]}
                    </Text>
                    <Text style={styles.value}>
                        <Text style={{ color: '#666' }}>Address:</Text> {invoice.customer[4]}, {invoice.customer[5]}, {invoice.customer[6]} {invoice.customer[7]}
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={{ fontSize: 12 }}>Invoice date: {formatDate(invoice.invoice_date)}</Text>
                    <Text style={{ fontSize: 12 }}>Invoice due date: {formatDate(invoice.invoice_due_date)}</Text>

                </View>

                <View style={styles.table}>
                    {/* Table Header */}
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableCell}>Nr.</Text>
                        <Text style={styles.tableCell}>Description</Text>
                        <Text style={styles.tableCell}>Quantity</Text>
                        <Text style={styles.tableCell}>Unit Price</Text>
                        <Text style={styles.tableCell}>Total</Text>
                    </View>

                    {/* Table Rows */}
                    {invoice.products.map((product, index) => (
                        <View style={styles.tableRow} key={index}>
                            <Text style={styles.tableCell}>{index+1}</Text>
                            <Text style={styles.tableCell}>{product[4]}</Text>
                            <Text style={styles.tableCell}>{product[6]}</Text>
                            <Text style={styles.tableCell}>{(product[5]/100).toFixed(2)}</Text>
                            <Text style={styles.tableCell}>{(product[7]/100).toFixed(2)}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.total}>
                    <Text style={{ ...styles.label, fontSize: 12 }}>Total:</Text>
                    <Text style={{ ...styles.value, fontSize: 12 }}>
                        {(invoice.total/100).toFixed(2)} €
                    </Text>
                </View>

                <Text style={styles.footer}>Thank you for your business!</Text>
            </Page>
        </Document>
    );
};

export default Invoicepdf;
