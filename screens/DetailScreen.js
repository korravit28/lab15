import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { deleteTransaction } from "../services/databaseService";

export default function DetailScreen({ route, navigation }) {
  const { item } = route.params;

  const handleDelete = async () => {
    Alert.alert("ยืนยันการลบ", "คุณต้องการลบรายการนี้ใช่หรือไม่?", [
      { text: "ยกเลิก", style: "cancel" },
      {
        text: "ลบ",
        style: "destructive",
        onPress: async () => {
          await deleteTransaction(item.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}> ชื่ อรายการ: </Text>{" "}
        <Text style={styles.value}> {item.title} </Text>
        <Text style={styles.label}> ประเภท: </Text>{" "}
        <Text
          style={[
            styles.value,
            { color: item.type === "income" ? "#2ECC71" : "#E74C3C" },
          ]}
        >
          {" "}
          {item.type === "income" ? "รายรับ" : "รายจ่าย"}{" "}
        </Text>
        <Text style={styles.label}> จำนวนเงิน: </Text>{" "}
        <Text style={styles.value}> ฿{Number(item.amount).toFixed(2)} </Text>
        <Text style={styles.label}> วั นที่ บั นทึก: </Text>{" "}
        <Text style={styles.value}>
          {" "}
          {new Date(item.createdAt).toLocaleString()}{" "}
        </Text>{" "}
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}> ลบรายการนี้ </Text>{" "}
      </TouchableOpacity>{" "}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA", padding: 20 },
  card: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 12,
    elevation: 3,
  },
  label: { fontSize: 14, color: "#7F8C8D", marginTop: 10 },
  value: { fontSize: 18, color: "#2C3E50", fontWeight: "bold", marginTop: 4 },
  deleteButton: {
    backgroundColor: "#E74C3C",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  deleteButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
