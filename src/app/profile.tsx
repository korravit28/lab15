import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../../services/databaseService";

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [inputName, setInputName] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  const showAlert = (title, message) => {
    if (Platform.OS === "web") {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleLogin = async () => {
    if (!inputName.trim() || !inputPassword.trim()) {
      showAlert(
        "ล็อกอินไม่สมบูรณ์",
        "กรุณากรอกชื่อผู้ใช้งานและรหัสผ่านให้ครบถ้วนครับ",
      );
      return;
    }

    const result = await loginUser(inputName, inputPassword);
    if (result.success) {
      setUser(inputName);
      setInputName("");
      setInputPassword("");
      router.replace("/profile"); // รีเฟรช Tabs ให้ปุ่มหน้าแรกและเพิ่มรายการแสดงขึ้นมา
    } else {
      showAlert("ล็อกอินไม่สมบูรณ์", result.message);
    }
  };

  const handleRegister = async () => {
    if (!inputName.trim() || !inputPassword.trim()) {
      showAlert(
        "การสมัครไม่สมบูรณ์",
        "กรุณากรอกชื่อผู้ใช้งานและรหัสผ่านเพื่อสมัครสมาชิก",
      );
      return;
    }

    const result = await registerUser(inputName, inputPassword);
    if (result.success) {
      showAlert("สำเร็จ", result.message);
      setUser(inputName);
      setInputName("");
      setInputPassword("");
      router.replace("/profile");
    } else {
      showAlert("การสมัครไม่สมบูรณ์", result.message);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    router.replace("/profile"); // รีเฟรช Tabs ให้ซ่อนปุ่มหน้าแรกและเพิ่มรายการ
  };

  return (
    <View style={styles.container}>
      {user ? (
        <View style={styles.profileCard}>
          <Ionicons name="person-circle-outline" size={100} color="#2ECC71" />
          <Text style={styles.name}>ผู้ใช้งาน: {user}</Text>
          <Text style={styles.statusText}>
            สถานะ: เข้าสู่ระบบแล้ว (ข้อมูลเฉพาะบุคคล)
          </Text>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>ออกจากระบบ (Logout)</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.loginCard}>
          <Text style={styles.sectionTitle}>เข้าสู่ระบบ / สมัครสมาชิก</Text>

          <Text style={styles.label}>ชื่อผู้ใช้</Text>
          <TextInput
            style={styles.input}
            placeholder="กรอกชื่อผู้ใช้ของคุณ"
            value={inputName}
            onChangeText={setInputName}
          />

          <Text style={styles.label}>รหัสผ่าน</Text>
          <TextInput
            style={styles.input}
            placeholder="กรอกรหัสผ่าน"
            secureTextEntry={true}
            value={inputPassword}
            onChangeText={setInputPassword}
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>เข้าสู่ระบบ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>สมัครสมาชิกใหม่</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ข้อมูลแอปพลิเคชัน</Text>
        <Text style={styles.infoText}>เวอร์ชัน: 1.0.0 (Expo Router)</Text>
        <Text style={styles.infoText}>
          สถานะ: ข้อมูลถูกแยกเก็บอิสระตามบัญชีผู้ใช้
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA", padding: 20 },
  profileCard: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
  },
  loginCard: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  name: { fontSize: 18, fontWeight: "bold", color: "#2C3E50", marginTop: 10 },
  statusText: {
    fontSize: 13,
    color: "#27AE60",
    marginTop: 4,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 10,
  },
  label: { fontSize: 14, color: "#34495E", marginBottom: 6, fontWeight: "600" },
  input: {
    backgroundColor: "#F9F9F9",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BDC3C7",
    fontSize: 16,
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: "#2ECC71",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  loginButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  registerButton: {
    backgroundColor: "#3498DB",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  registerButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  logoutButton: {
    backgroundColor: "#E74C3C",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  logoutButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  section: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  infoText: { fontSize: 14, color: "#34495E", marginBottom: 6 },
});
