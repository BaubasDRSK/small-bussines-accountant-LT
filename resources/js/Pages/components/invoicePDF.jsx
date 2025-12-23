import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// 1. Stable Font Registration (Using static .ttf files)
// Font.register({
//     family: 'openSans',
//     fonts: [
//         { 
//             src: 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/opensans/static/OpenSans-Regular.ttf', 
//             fontWeight: 400 
//         },
//         { 
//             src: 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/opensans/static/OpenSans-Bold.ttf', 
//             fontWeight: 700 
//         }
//     ]
// });

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#374151',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        borderBottom: 2,
        borderBottomColor: '#6366f1',
        paddingBottom: 20,
    },
    brandName: {
        fontSize: 18,
        fontWeight: 700,
        color: '#1e1b4b',
    },
    invoiceMeta: {
        textAlign: 'right',
    },
    invoiceTitle: {
        fontSize: 22,
        color: '#6366f1',
        fontWeight: 700,
        marginBottom: 4,
    },
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
        fontWeight: 700,
    },
    entityName: {
        fontSize: 11,
        fontWeight: 700,
        marginBottom: 2,
        color: '#111827',
    },
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
    colNr: { width: '10%', paddingLeft: 8 },
    colDesc: { width: '50%', paddingLeft: 8 },
    colQty: { width: '10%', textAlign: 'center' },
    colPrice: { width: '15%', textAlign: 'right' },
    colTotal: { width: '15%', textAlign: 'right', paddingRight: 8 },
    headerCell: {
        fontWeight: 700,
        color: '#4b5563',
        fontSize: 9,
    },
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
        fontWeight: 700,
        color: '#6366f1',
    },
    footer: {
        marginTop: 50,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
    }
});

// Helper to ensure we always return a string for the PDF renderer
const formatDate = (dateValue) => {
    if (!dateValue) return '';
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return String(dateValue);
    return d.toISOString().split('T')[0];
};

const Invoicepdf = ({ invoice, company }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.brandName}>{String(company?.name || '')}</Text>
                    </View>
                    <View style={styles.invoiceMeta}>
                        <Text style={styles.invoiceTitle}>INVOICE</Text>
                        <Text style={{ fontWeight: 700 }}>#{String(invoice?.invoice_number || '')}</Text>
                        <Text>Date: {formatDate(invoice?.invoice_date)}</Text>
                        <Text style={{ color: '#ef4444' }}>Due: {formatDate(invoice?.invoice_due_date)}</Text>
                    </View>
                </View>

                {/* Seller & Buyer */}
                <View style={styles.addressContainer}>
                    <View style={styles.addressGroup}>
                        <Text style={styles.sectionLabel}>From</Text>
                        <Text style={styles.entityName}>{String(company?.name || '')}</Text>
                        <Text>Code: {String(company?.code || '')}</Text>
                        <Text>VAT: {String(company?.vat_code || '')}</Text>
                        <Text>{String(company?.street || '')}, {String(company?.city || '')}</Text>
                    </View>
                    <View style={styles.addressGroup}>
                        <Text style={styles.sectionLabel}>Bill To</Text>
                        <Text style={styles.entityName}>{String(invoice?.customer?.[1] || '')}</Text>
                        <Text>Code: {String(invoice?.customer?.[2] || '')}</Text>
                        <Text>VAT: {String(invoice?.customer?.[3] || '')}</Text>
                        <Text>{String(invoice?.customer?.[4] || '')}, {String(invoice?.customer?.[5] || '')}</Text>
                    </View>
                </View>

                {/* Table */}
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.colNr, styles.headerCell]}>Nr.</Text>
                        <Text style={[styles.colDesc, styles.headerCell]}>Description</Text>
                        <Text style={[styles.colQty, styles.headerCell]}>Qty</Text>
                        <Text style={[styles.colPrice, styles.headerCell]}>Price</Text>
                        <Text style={[styles.colTotal, styles.headerCell]}>Total</Text>
                    </View>

                    {(invoice?.products || []).map((product, index) => (
                        <View style={styles.tableRow} key={index}>
                            <Text style={styles.colNr}>{String(index + 1)}</Text>
                            <Text style={styles.colDesc}>{String(product[4] || '')}</Text>
                            <Text style={styles.colQty}>{String(product[6] || '0')}</Text>
                            <Text style={styles.colPrice}>{((product[5] || 0) / 100).toFixed(2)}</Text>
                            <Text style={styles.colTotal}>{((product[7] || 0) / 100).toFixed(2)}</Text>
                        </View>
                    ))}
                </View>

                {/* Summary */}
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryBox}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalText}>Total:</Text>
                            <Text style={styles.totalText}>{((invoice?.total || 0) / 100).toFixed(2)} €</Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.sectionLabel}>Payment Details</Text>
                    <Text>Bank: {String(company?.bank_name || 'N/A')}</Text>
                    <Text>Account: {String(company?.bank_account || 'N/A')}</Text>
                </View>
            </Page>
        </Document>
    );
};

export default Invoicepdf;