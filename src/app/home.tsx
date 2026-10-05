import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getTransactions, getCurrentUser } from '../../services/databaseService';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    const data = await getTransactions();
    setTransactions(data);
  };

  const totalBalance = transactions.reduce((sum, item) => {
    return item.type === 'income' ? sum + Number(item.amount) : sum - Number(item.amount);
  }, 0);

  return (
    <View style={styles.container}>
      {user && (
        <View style={styles.welcomeBox}>
          <Text style={styles.welcomeText}>ยินดีต้อนรับ, {user}</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>ยอดเงินคงเหลือทั้งหมด</Text>
        <Text style={styles.balanceText}>฿{totalBalance.toFixed(2)}</Text>
      </View>

      <Text style={styles.sectionTitle}>ประวัติรายการทั้งหมด</Text>

      {transactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={60} color="#BDC3C7" />
          <Text style={styles.emptyText}>ยังไม่มีรายการบันทึกในระบบ</Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <View>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
              </View>
              <Text style={[styles.itemAmount, { color: item.type === 'income' ? '#2ECC71' : '#E74C3C' }]}>
                {item.type === 'income' ? '+' : '-'}฿{Number(item.amount).toFixed(2)}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 16 },
  welcomeBox: { marginBottom: 15 },
  welcomeText: { fontSize: 16, fontWeight: 'bold', color: '#2C3E50' },
  card: { backgroundColor: '#2ECC71', padding: 20, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  cardTitle: { color: '#FFF', fontSize: 16, marginBottom: 5 },
  balanceText: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2C3E50', marginBottom: 10 },
  itemRow: { backgroundColor: '#FFF', padding: 15, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, elevation: 2 },
  itemTitle: { fontSize: 16, color: '#2C3E50', fontWeight: '500' },
  itemDate: { fontSize: 12, color: '#7F8C8D', marginTop: 4 },
  itemAmount: { fontSize: 16, fontWeight: 'bold' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#7F8C8D', fontSize: 16, marginTop: 10 }
});