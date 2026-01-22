import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

import robotoNormal from './invoicePDF/Roboto-Regular.ttf';
import robotoBold from './invoicePDF/Roboto-Bold.ttf';

import { amountToWordsLT } from './invoicePDF/amountToWords';

Font.register({
  family: 'Roboto',
  fonts: [
    { src: robotoNormal, fontWeight: 'normal' },
    { src: robotoBold, fontWeight: 'bold' },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Roboto',
    fontSize: 9,
    color: '#000',
  },

  invoice: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 20,
    marginBottom: 20,
  },

  seller: {
    marginBottom: 6,
  },

  small: {
    fontSize: 7,
  },

  title: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  field: {
    marginTop: 6,
  },

  underline: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 2,
    marginTop: 2,
  },

  amountRow: {
    marginTop: 8,
  },

  signatures: {
    marginTop: 18,
  },

  signLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    width: '60%',
    marginTop: 10,
  },
});

const formatDateLT = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()} m. ${d.getMonth() + 1} mėn. ${d.getDate()} d.`;
};


const ReceiptBlock = ({ invoice, company }) => {
  const amount = ((invoice.total || 0) / 100).toFixed(2);

  return (
    <View style={styles.invoice}>
      {/* Seller */}
      <View style={styles.seller}>
        <Text>{company.name}, {company.address}</Text>
        <Text style={styles.small}>
          (prekes / paslaugas parduodantis ūkio subjektas)
        </Text>
        <Text style={{ marginTop: 4 }}>
          {company.activity_code}
        </Text>
        <Text style={styles.small}>(Indv. veiklos pažyma)</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>PINIGŲ PRIĖMIMO KVITAS</Text>

      {/* Series & date */}
      <View style={styles.row}>
        <Text>
          Serija {invoice.series} Nr. {invoice.number}
        </Text>
        <Text>{formatDateLT(invoice.date)}</Text>
      </View>

      {/* Reason */}
      <View style={styles.field}>
        <Text>Sumokėti už</Text>
        <Text style={styles.underline}>{invoice.reason}</Text>
        <Text style={styles.small}>
          (prekių / paslaugų pavadinimai, kiekiai, matavimo vienetai, vieneto kaina)
        </Text>
      </View>

      {/* Amount */}
      <View style={styles.amountRow}>
        <Text>
          Sumokėta suma {amountToWordsLT(amount)}
        </Text>
        <Text>
          {amount} EUR
        </Text>
      </View>

      {/* Signatures */}
      <View style={styles.signatures}>
        <Text>Sumokėjau</Text>
        <View style={styles.signLine} />
        <Text style={styles.small}>
          (parašas, pirkėjo vardas, pavardė)
        </Text>

        <Text style={{ marginTop: 10 }}>
          Pinigus gavau {company.name}
        </Text>
        <View style={styles.signLine} />
        <Text style={styles.small}>(parašas)</Text>
      </View>
    </View>
  );
};

const CashOrderPDF = ({ invoice, company }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* COPY 1 */}
      <ReceiptBlock invoice={invoice} company={company} />

      {/* COPY 2 (IDENTICAL) */}
      <ReceiptBlock invoice={invoice} company={company} />
    </Page>
  </Document>
);

export default CashOrderPDF;
