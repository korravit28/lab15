import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getTransactions } from "../services/databaseService";

export default function HomeScreen({ navigation }) {
  const [transactions, setTransactions] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  const loadData = async () => {
    const data = await getTransactions();
    setTransactions(data);
  };

  const totalBalance = transactions.reduce((sum, item) => {
    return item.type === "income"
      ? sum + Number(item.amount)
      : sum - Number(item.amount);
  }, 0);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}> ยอดเงินคงเหลือทั้ งหมด </Text>{" "}
        <Text style={styles.balanceText}>
          {" "}
          ฿{totalBalance.toFixed(2)}{" "}
        </Text>{" "}
      </View>
      <Text style={styles.sectionTitle}> ประวั ติรายการล่ าสุด </Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemRow}
            onPress={() => navigation.navigate("Detail", { item })}
          >
            <View>
              <Text style={styles.itemTitle}> {item.title} </Text>{" "}
              <Text style={styles.itemDate}>
                {" "}
                {new Date(item.createdAt).toLocaleDateString()}{" "}
              </Text>{" "}
            </View>{" "}
            <Text
              style={[
                styles.itemAmount,
                { color: item.type === "income" ? "#2ECC71" : "#E74C3C" },
              ]}
            >
              {" "}
              {item.type === "income" ? "+" : "-"}฿{" "}
              {Number(item.amount).toFixed(2)}{" "}
            </Text>{" "}
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("Add")}
      >
        <Text style={styles.fabText}> + </Text>{" "}
      </TouchableOpacity>{" "}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA", padding: 16 },
  card: {
    backgroundColor: "#2ECC71",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: { color: "#FFF", fontSize: 16, marginBottom: 5 },
  balanceText: { color: "#FFF", fontSize: 32, fontWeight: "bold" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 10,
  },
  itemRow: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    elevation: 2,
  },
  itemTitle: { fontSize: 16, color: "#2C3E50", fontWeight: "500" },
  itemDate: { fontSize: 12, color: "#7F8C8D", marginTop: 4 },
  itemAmount: { fontSize: 16, fontWeight: "bold" },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#27AE60",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  fabText: { color: "#FFF", fontSize: 30, fontWeight: "bold" },
});
