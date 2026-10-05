import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { saveTransaction } from "../services/databaseService";

export default function AddScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");

  const handleSave = async () => {
    if (!title.trim() || !amount.trim()) {
      Alert.alert("แจ้งเตือน", "กรุณากรอกชื่อรายการและจำนวนเงินให้ครบถ้วน");
      return;
    }

    const newTransaction = {
      id: Date.now().toString(),
      title,
      amount: parseFloat(amount),
      type,
      createdAt: new Date().toISOString(),
    };

    await saveTransaction(newTransaction);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}> ประเภทรายการ </Text>{" "}
      <View style={styles.typeContainer}>
        <TouchableOpacity
          style={[
            styles.typeBtn,
            type === "income" && { backgroundColor: "#2ECC71" },
          ]}
          onPress={() => setType("income")}
        >
          <Text style={styles.typeText}> รายรั บ </Text>{" "}
        </TouchableOpacity>{" "}
        <TouchableOpacity
          style={[
            styles.typeBtn,
            type === "expense" && { backgroundColor: "#E74C3C" },
          ]}
          onPress={() => setType("expense")}
        >
          <Text style={styles.typeText}> รายจ่ าย </Text>{" "}
        </TouchableOpacity>{" "}
      </View>
      <Text style={styles.label}> ชื่ อรายการ </Text>{" "}
      <TextInput
        style={styles.input}
        placeholder="เช่น ค่าอาหาร, เงินเดือน"
        value={title}
        onChangeText={setTitle}
      />
      <Text style={styles.label}> จำนวนเงิน(บาท) </Text>{" "}
      <TextInput
        style={styles.input}
        placeholder="0.00"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}> บั นทึกรายการ </Text>{" "}
      </TouchableOpacity>{" "}
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
    backgroundColor: "#27AE60",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  saveButtonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
});
