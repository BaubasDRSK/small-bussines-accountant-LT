import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import openSans from './OpenSans.ttf';

Font.register({
    family: 'openSans',
    fonts: [{ src: openSans }]
});

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'openSans',
        fontSize: 10,
        color: '#374151',
    },
    // Modern Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        borderBottom: 2,
        borderBottomColor: '#6366f1',
        paddingBottom: 20,
    },
    logoSection: {
        flexDirection: 'column',
    },
    image: {
        width: 60,
        height: 60,
        marginBottom: 8,
    },
    brandName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e1b4b',
    },
    invoiceMeta: {
        textAlign: 'right',
    },
    invoiceTitle: {
        fontSize: 22,
        color: '#6366f1',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    // Addresses
    addressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    addressGroup: {
        width: '45%',
    },
    sectionLabel: {
        fontSize: 8,
        textTransform: 'uppercase',
        color: '#9ca3af',
        marginBottom: 4,
        fontWeight: 'bold',
    },
    entityName: {
        fontSize: 11,
        fontWeight: 'bold',
        marginBottom: 2,
        color: '#111827',
    },
    // Table
    table: {
        marginTop: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f9fafb',
        borderBottomColor: '#6366f1',
        borderBottomWidth: 2,
        alignItems: 'center',
        height: 30,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomColor: '#f3f4f6',
        borderBottomWidth: 1,
        alignItems: 'center',
        minHeight: 35,
    },
    // Column widths
    colNr: { width: '10%', paddingLeft: 8 },
    colDesc: { width: '50%', paddingLeft: 8 },
    colQty: { width: '10%', textAlign: 'center' },
    colPrice: { width: '15%', textAlign: 'right' },
    colTotal: { width: '15%', textAlign: 'right', paddingRight: 8 },
    
    headerCell: {
        fontWeight: 'bold',
        color: '#4b5563',
        fontSize: 9,
    },
    // Summary
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
    },
    summaryBox: {
        width: '35%',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        marginTop: 10,
        paddingTop: 10,
    },
    totalText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#6366f1',
    },
    footer: {
        marginTop: 50,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
    }
});

const formatDate = (date) => {
    if (!date) return '';
    const formattedDate = new Date(date);
    if (isNaN(formattedDate)) return '';
    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
    const day = String(formattedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const Invoicepdf = ({ invoice, company }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header Section */}
                <View style={styles.header}>
                    <View style={styles.logoSection}>
                        <Image style={styles.image} src='http://accountant.fun/img/logo.png' />
                        <Text style={styles.brandName}>{company.name}</Text>
                    </View>
                    <View style={styles.invoiceMeta}>
                        <Text style={styles.invoiceTitle}>INVOICE</Text>
                        <Text style={{ fontWeight: 'bold' }}>#{invoice.invoice_number}</Text>
                        <Text>Date: {formatDate(invoice.invoice_date)}</Text>
                        <Text style={{ color: '#ef4444' }}>Due: {formatDate(invoice.invoice_due_date)}</Text>
                    </View>
                </View>

                {/* Seller & Buyer Details */}
                <View style={styles.addressContainer}>
                    <View style={styles.addressGroup}>
                        <Text style={styles.sectionLabel}>From</Text>
                        <Text style={styles.entityName}>{company.name}</Text>
                        <Text>Code: {company.code}</Text>
                        <Text>VAT: {company.vat_code}</Text>
                        <Text>{company.street}, {company.city}, {company.country}</Text>
                        <Text>{company.web}</Text>
                    </View>
                    <View style={styles.addressGroup}>
                        <Text style={styles.sectionLabel}>Bill To</Text>
                        <Text style={styles.entityName}>{invoice.customer[1]}</Text>
                        <Text>Code: {invoice.customer[2]}</Text>
                        <Text>VAT: {invoice.customer[3]}</Text>
                        <Text>{invoice.customer[4]}, {invoice.customer[5]}, {invoice.customer[6]}</Text>
                    </View>
                </View>

                {/* Table */}
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.colNr, styles.headerCell]}>Nr.</Text>
                        <Text style={[styles.colDesc, styles.headerCell]}>Description</Text>
                        <Text style={[styles.colQty, styles.headerCell]}>Qty</Text>
                        <Text style={[styles.colPrice, styles.headerCell]}>Unit Price</Text>
                        <Text style={[styles.colTotal, styles.headerCell]}>Total</Text>
                    </View>

                    {invoice.products.map((product, index) => (
                        <View style={styles.tableRow} key={index}>
                            <Text style={styles.colNr}>{index + 1}</Text>
                            <Text style={styles.colDesc}>{product[4]}</Text>
                            <Text style={styles.colQty}>{product[6]}</Text>
                            <Text style={styles.colPrice}>{(product[5] / 100).toFixed(2)}</Text>
                            <Text style={styles.colTotal}>{(product[7] / 100).toFixed(2)}</Text>
                        </View>
                    ))}
                </View>

                {/* Summary */}
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryBox}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalText}>Total Amount:</Text>
                            <Text style={styles.totalText}>{(invoice.total / 100).toFixed(2)} €</Text>
                        </View>
                    </View>
                </View>

                {/* Footer Section */}
                <View style={styles.footer}>
                    <Text style={styles.sectionLabel}>Payment Details</Text>
                    <Text style={{ marginBottom: 4 }}>Bank: {company.bank_name || 'Swedbank AB'}</Text>
                    <Text>Account: {company.bank_account || 'LT7300002252255'}</Text>
                    
                    <Text style={[styles.sectionLabel, { marginTop: 15 }]}>Notes</Text>
                    <Text style={{ fontSize: 9, color: '#6b7280', fontStyle: 'italic' }}>
                        {invoice.invoice_notes || 'Thank you for your business!'}
                    </Text>
                </View>
            </Page>
        </Document>
    );
};

export default Invoicepdf;