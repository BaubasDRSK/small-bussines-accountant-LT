import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image as PDFImage } from '@react-pdf/renderer';

import logo from './invoicePDF/logo.png';
import robotoNormal from './invoicePDF/Roboto-Regular.ttf';
import robotoBlack from './invoicePDF/Roboto-Black.ttf';
import robotoBold from './invoicePDF/Roboto-Bold.ttf';

import { amountToWordsLT } from './invoicePDF/amountToWords';

// Registering Roboto with working URLs
Font.register({
    family: 'Roboto',
  fonts: [
    {
      src: robotoNormal,
      fontWeight: 'normal',
    },
    {
      src: robotoBold,
      fontWeight: 'bold',
    },
  ],
});

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Roboto', // Applied Roboto globally to the page
        fontSize: 10,
        color: '#374151',
    },
    logo: {
        height: 80,        
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        borderBottom: 1,
        borderBottomColor: '#108fca',
        paddingBottom: 20,
    },
    invoiceMeta: {
        textAlign: 'right',
        width: '50%',
    },
    invoiceTitle: {
        fontSize: 22,
        color: '#108fca',
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
        borderBottomColor: '#108fca',
        borderBottomWidth: 1,
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
        color: 'black',
    },
    amountInWords: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width:'100%',
        fontSize: 8,
        fontWeight: 400,
        color: 'black',
        marginTop: '5px',
    },

    footer: {
        marginTop: 50,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
    }
});

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
                        <PDFImage
                            style={styles.logo}
                            src={logo}
                        />
                    </View>
                    <View style={styles.invoiceMeta}>
                        <Text style={styles.invoiceTitle}>
                            {invoice.registered ? "SĄSKAITA" : "IŠANKSTINĖ SĄSKAITA"}
                        </Text>
                        <Text style={{ fontWeight: 700, fontSize: 16 }}>
                            Serija ir nr.: {' '}{String(invoice?.invoice_number || '')}
                        </Text>
                        {/* Explicit space after colons for better readability */}
                        <Text>Sąskaitos data: {' '}{formatDate(invoice?.invoice_date)}</Text>
                        <Text style={{ color: '#ef4444' }}>
                            Apmokėti iki: {' '}{formatDate(invoice?.invoice_due_date)}
                        </Text>
                    </View>
                </View>

                {/* Seller & Buyer */}
                <View style={styles.addressContainer}>
                    <View style={styles.addressGroup}>
                        <Text style={styles.sectionLabel}>PARDAVĖJAS</Text>
                        <Text style={styles.entityName}>{String(company?.name || '')}</Text>
                        <Text>{company?.code ? `Indv. veikla nr.: ${String(company.code)}` : null}</Text>
                        
                        {company?.vat_code && company.vat_code !== "-" ? (
                                <Text>PVM kodas: {String(company.vat_code)}</Text>
                            ) : null}
                        
                        <Text>{String(company?.street || '')}</Text>
                        <Text>{String(company?.city || '')}</Text>
                        <Text>Bankas: {String(company?.bank_name || 'N/A')}</Text>
                        <Text>Banko sąskaita: {String(company?.bank_account || 'N/A')}</Text>
                        <Text>Tel: {String(company?.phone || 'N/A')}</Text>
                    </View>
                    <View style={styles.addressGroup}>  
                        <Text style={styles.sectionLabel}>Pirkėjas</Text>
                        <Text style={styles.entityName}>{String(invoice?.customer?.[1] || '')}</Text>
                        <Text>Įmonės kodas: {String(invoice?.customer?.[2] || '')}</Text>
                        <Text>PVM mokėtojo kodas: {String(invoice?.customer?.[3] || '-')}</Text>
                        <Text>{String(invoice?.customer?.[4] || '')}, {String(invoice?.customer?.[5] || '')}</Text>
                    </View>
                </View>

                {/* Table */}
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.colNr, styles.headerCell]}>Nr.</Text>
                        <Text style={[styles.colDesc, styles.headerCell]}>Pavadinimas</Text>
                        <Text style={[styles.colQty, styles.headerCell]}>Kiekis</Text>
                        <Text style={[styles.colPrice, styles.headerCell]}>Kaina</Text>
                        <Text style={[styles.colTotal, styles.headerCell]}>Viso</Text>
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
                            <Text style={styles.totalText}>Galutinė suma:</Text>
                            <Text style={styles.totalText}>{((invoice?.total || 0) / 100).toFixed(2)} €</Text>
                        </View>
                    </View>
                </View>
                <View >
                    <View style={styles.amountInWords}>
                            <Text >Suma žodžiais:  </Text>
                            <Text >{amountToWordsLT(((invoice?.total || 0) / 100).toFixed(2))}</Text>
                    </View>
                </View>

                {/* Footer
                <View style={styles.footer}>
                    <Text style={styles.sectionLabel}>Payment Details</Text>
                    <Text>Bank: {String(company?.bank_name || 'N/A')}</Text>
                    <Text>Account: {String(company?.bank_account || 'N/A')}</Text>
                </View> */}
            </Page>
        </Document>
    );
};

export default Invoicepdf;