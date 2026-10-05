import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  deleteTransaction,
  getTransactions,
  saveTransaction,
  updateTransaction,
} from "../../services/databaseService";

export default function AddScreen() {
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [editingId, setEditingId] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  const loadData = async () => {
    const data = await getTransactions();
    setTransactions(data);
  };

  const showAlert = (title, message) => {
    if (Platform.OS === "web") {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleSaveOrUpdate = async () => {
    if (!title.trim() || !amount.trim()) {
      showAlert("แจ้งเตือน", "กรุณากรอกชื่อรายการและจำนวนเงินให้ครบถ้วน");
      return;
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      showAlert("แจ้งเตือน", "กรุณากรอกจำนวนเงินเป็นตัวเลขที่มากกว่า 0");
      return;
    }

    if (editingId) {
      const updatedItem = {
        id: editingId,
        title,
        amount: parseFloat(amount),
        type,
        createdAt: new Date().toISOString(),
      };
      await updateTransaction(updatedItem);
      showAlert("สำเร็จ", "แก้ไขรายการเรียบร้อยแล้ว");
      setEditingId(null);
    } else {
      const newItem = {
        id: Date.now().toString(),
        title,
        amount: parseFloat(amount),
        type,
        createdAt: new Date().toISOString(),
      };
      await saveTransaction(newItem);
      showAlert("สำเร็จ", "เพิ่มรายการเรียบร้อยแล้ว");
    }

    setTitle("");
    setAmount("");
    setType("expense");
    loadData();
  };

  const handleEditPress = (item) => {
    setEditingId(item.id);
    setTitle(item.title);
    setAmount(item.amount.toString());
    setType(item.type);
  };

  const handleDeletePress = (id) => {
    if (Platform.OS === "web") {
      if (window.confirm("คุณต้องการลบรายการนี้ใช่หรือไม่?")) {
        deleteTransaction(id).then(() => loadData());
      }
    } else {
      Alert.alert("ยืนยันการลบ", "คุณต้องการลบรายการนี้ใช่หรือไม่?", [
        { text: "ยกเลิก", style: "cancel" },
        {
          text: "ลบ",
          style: "destructive",
          onPress: async () => {
            await deleteTransaction(id);
            loadData();
          },
        },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formCard}>
        <Text style={styles.formHeader}>
          {editingId ? "แก้ไขรายการ" : "เพิ่มรายการใหม่"}
        </Text>

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
        <TextInput
          style={styles.input}
          placeholder="เช่น ค่าอาหาร, เงินเดือน"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>จำนวนเงิน (บาท)</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <TouchableOpacity
          style={[
            styles.saveButton,
            editingId && { backgroundColor: "#3498DB" },
          ]}
          onPress={handleSaveOrUpdate}
        >
          <Text style={styles.saveButtonText}>
            {editingId ? "บันทึกการแก้ไข" : "บันทึกรายการ"}
          </Text>
        </TouchableOpacity>

        {editingId && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setEditingId(null);
              setTitle("");
              setAmount("");
            }}
          >
            <Text style={styles.cancelButtonText}>ยกเลิกการแก้ไข</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.sectionTitle}>จัดการรายการทั้งหมดของคุณ</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text
                style={[
                  styles.itemAmount,
                  { color: item.type === "income" ? "#2ECC71" : "#E74C3C" },
                ]}
              >
                {item.type === "income" ? "+" : "-"}฿
                {Number(item.amount).toFixed(2)}
              </Text>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => handleEditPress(item)}
              >
                <Ionicons name="pencil" size={18} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDeletePress(item.id)}
              >
                <Ionicons name="trash" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA", padding: 16 },
  formCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
  },
  formHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    color: "#2C3E50",
    fontWeight: "600",
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#F9F9F9",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BDC3C7",
    fontSize: 15,
  },
  typeContainer: { flexDirection: "row", justifyContent: "space-between" },
  typeBtn: {
    flex: 1,
    padding: 10,
    backgroundColor: "#BDC3C7",
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 2,
  },
  typeText: { color: "#FFF", fontWeight: "bold", fontSize: 14 },
  saveButton: {
    backgroundColor: "#27AE60",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  saveButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  cancelButton: {
    backgroundColor: "#95A5A6",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  cancelButtonText: { color: "#FFF", fontSize: 14, fontWeight: "bold" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
  },
  itemRow: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    elevation: 1,
  },
  itemTitle: { fontSize: 16, color: "#2C3E50", fontWeight: "500" },
  itemAmount: { fontSize: 15, fontWeight: "bold", marginTop: 3 },
  actionButtons: { flexDirection: "row" },
  editBtn: {
    backgroundColor: "#3498DB",
    padding: 8,
    borderRadius: 6,
    marginRight: 6,
  },
  deleteBtn: { backgroundColor: "#E74C3C", padding: 8, borderRadius: 6 },
});
