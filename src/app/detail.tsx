import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { deleteTransaction } from "../../services/databaseService";

export default function DetailScreen() {
  const router = useRouter();
  const { item: itemString } = useLocalSearchParams();
  const item = itemString ? JSON.parse(itemString) : null;

  if (!item) {
    return (
      <View style={styles.container}>
        <Text>ไม่พบข้อมูลรายละเอียด</Text>
      </View>
    );
  }

  const handleDelete = async () => {
    Alert.alert("ยืนยันการลบ", "คุณต้องการลบรายการนี้ใช่หรือไม่?", [
      { text: "ยกเลิก", style: "cancel" },
      {
        text: "ลบ",
        style: "destructive",
        onPress: async () => {
          await deleteTransaction(item.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>ชื่อรายการ:</Text>
        <Text style={styles.value}>{item.title}</Text>

        <Text style={styles.label}>ประเภท:</Text>
        <Text
          style={[
            styles.value,
            { color: item.type === "income" ? "#2ECC71" : "#E74C3C" },
          ]}
        >
          {item.type === "income" ? "รายรับ" : "รายจ่าย"}
        </Text>

        <Text style={styles.label}>จำนวนเงิน:</Text>
        <Text style={styles.value}>฿{Number(item.amount).toFixed(2)}</Text>

        <Text style={styles.label}>วันที่บันทึก:</Text>
        <Text style={styles.value}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() =>
          router.push({
            pathname: "/edit",
            params: { item: JSON.stringify(item) },
          })
        }
      >
        <Text style={styles.editButtonText}>แก้ไขรายการนี้</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>ลบรายการนี้</Text>
      </TouchableOpacity>
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
  editButton: {
    backgroundColor: "#3498DB",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  editButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  deleteButton: {
    backgroundColor: "#E74C3C",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  deleteButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
