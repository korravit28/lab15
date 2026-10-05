import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { updateTransaction } from "../../services/databaseService";

export default function EditScreen() {
  const router = useRouter();
  const { item: itemString } = useLocalSearchParams();
  const item = itemString ? JSON.parse(itemString) : null;

  const [title, setTitle] = useState(item ? item.title : "");
  const [amount, setAmount] = useState(item ? item.amount.toString() : "");
  const [type, setType] = useState(item ? item.type : "expense");

  const handleUpdate = async () => {
    if (!title.trim() || !amount.trim()) {
      Alert.alert("แจ้งเตือน", "กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const updatedItem = {
      ...item,
      title,
      amount: parseFloat(amount),
      type,
    };

    await updateTransaction(updatedItem);
    Alert.alert("สำเร็จ", "แก้ไขข้อมูลเรียบร้อยแล้ว", [
      { text: "ตกลง", onPress: () => router.replace("/") },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>ประเภทรายการ</Text>
      <View style={styles.typeContainer}>
        <TouchableOpacity
          style={[
            styles.typeBtn,
            type === "income" && { backgroundColor: "#2ECC71" },
          ]}
          onPress={() => setType("income")}
        >
          <Text style={styles.typeText}>รายรับ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.typeBtn,
            type === "expense" && { backgroundColor: "#E74C3C" },
          ]}
          onPress={() => setType("expense")}
        >
          <Text style={styles.typeText}>รายจ่าย</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>ชื่อรายการ</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>จำนวนเงิน (บาท)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
        <Text style={styles.saveButtonText}>บันทึกการแก้ไข</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA", padding: 20 },
  label: {
    fontSize: 16,
    color: "#2C3E50",
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BDC3C7",
    fontSize: 16,
  },
  typeContainer: { flexDirection: "row", justifyContent: "space-between" },
  typeBtn: {
    flex: 1,
    padding: 12,
    backgroundColor: "#BDC3C7",
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 4,
  },
  typeText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  saveButton: {
    backgroundColor: "#2980B9",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  saveButtonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
});
