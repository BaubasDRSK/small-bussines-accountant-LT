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
    fontSize: 10,
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
    alignSelf: 'center',
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
    flexDirection: 'row',
    justifyContent: 'flex-start',
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


const today = new Date();
const formattedDate = `${today.getFullYear()} ${String(
    today.getMonth() + 1
  ).padStart(2, '0')} ${String(today.getDate()).padStart(2, '0')}`;

const ReceiptBlock = ({ invoice, company }) => {
  const amount = ((invoice.total || 0) / 100).toFixed(2);
  const eurosCents = amount.split('.');
  return (
    <View style={styles.invoice}>
      {/* Seller */}
      <View style={styles.seller}>
        <Text style={{fontWeight: 'bold', width: '100%', textAlign: 'center'}}>{company.name}, {company.street},  {company.city},  {company.country}</Text>
        <Text style={[styles.signLine, { width: '70%',  alignSelf: 'center', textAlign: 'center'}]} />
        <Text style={[styles.small, { width: '70%', alignSelf: 'center', textAlign: 'center'}]}>
          (prekes / paslaugas parduodantis ūkio subjektas)
        </Text>
        <Text style={{fontWeight: 'bold', fontsize:14, marginTop: 4, width: '50%',  alignSelf: 'center', textAlign: 'center' }}>
          {company.code}
        </Text>
        <Text style={[styles.signLine, { width: '50%',  alignSelf: 'center', textAlign: 'center'}]} />
        <Text style={[styles.small, { width: '50%',  alignSelf: 'center', textAlign: 'center'}]}>(Indv. veiklos pažyma)</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>PINIGŲ PRIĖMIMO KVITAS</Text>

      {/* Series & date */}
      <View style={styles.row}>
        <Text style={{ fontWeight: 'bold' }}>
          Serija/Nr. <Text style={{fontWeight: 'bold', fontSize: 18}}>{invoice.cash_order}</Text>
        </Text>
      </View>
      <View style={styles.row}>
        <Text>{formattedDate}</Text>  
      </View>

      {/* Reason */}
      <View style={styles.field}>
        <Text>Sumokėti už: 
            <Text style={{ fontWeight: 'bold' }}> 
              {invoice.registered ? "prekes ar paslaugas pagal saskaitą  "  : "prekes ar paslaugas pagal išankstinę sąskaitą  "}{invoice.invoice_number}
            </Text>
          </Text>
        <Text style={styles.underline}>{invoice.reason}</Text>
        <Text style={[styles.small, {alignSelf:"center"}]}>
          (prekių / paslaugų pavadinimai, kiekiai, matavimo vienetai, vieneto kaina)
        </Text>
      </View>

      <View style={{ marginBottom: "25px" }}>
       
      </View>

      {/* Amount */}
      <View style={styles.row}>
        <Text>
          Sumokėta suma: <Text style={{ fontWeight: 'bold' }}> {amountToWordsLT(amount)}  |  {eurosCents[0]} Eur, {eurosCents[1]} ct.</Text>
        </Text>
      </View>

      {/* Signatures */}
      <View style={styles.signatures}>
        <Text>Sumokėjau:  </Text>
        <View style={styles.signLine} />
      </View>
      <Text style={[styles.small, {alignSelf:"center"}]}>
          (parašas, vardas, pavardė)
      </Text>
      <View style={styles.signatures}>
        <Text style={{ marginTop: 10 }}>
          Pinigus gavau:  
        </Text>
        <View style={styles.signLine} />
      </View>
      <Text style={[styles.small, {alignSelf:"center"}]}>( (parašas, vardas, pavardė))</Text>
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
