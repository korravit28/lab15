import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "@pocket_money_current_user";
const USERS_DB_KEY = "@pocket_money_users_db";

export const getCurrentUser = async () => {
  try {
    return await AsyncStorage.getItem(USER_KEY);
  } catch (e) {
    return null;
  }
};

export const setCurrentUser = async (username) => {
  try {
    await AsyncStorage.setItem(USER_KEY, username);
  } catch (e) {}
};

export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (e) {}
};

const getUsersDB = async () => {
  try {
    const data = await AsyncStorage.getItem(USERS_DB_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
};

export const loginUser = async (username, password) => {
  const users = await getUsersDB();
  if (users[username]) {
    if (users[username] === password) {
      await setCurrentUser(username);
      return { success: true, message: "เข้าสู่ระบบสำเร็จ" };
    } else {
      return {
        success: false,
        message: "รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง",
      };
    }
  } else {
    return {
      success: false,
      message: "ไม่พบชื่อผู้ใช้นี้ในระบบ กรุณาสมัครสมาชิกก่อนครับ",
    };
  }
};

export const registerUser = async (username, password) => {
  const users = await getUsersDB();
  if (users[username]) {
    return { success: false, message: "ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว" };
  }
  users[username] = password;
  await AsyncStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  await setCurrentUser(username);
  return { success: true, message: "สมัครสมาชิกและเข้าสู่ระบบสำเร็จ" };
};

export const getTransactions = async () => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return [];
    const jsonValue = await AsyncStorage.getItem(
      `@pocket_money_transactions_${currentUser}`,
    );
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    return [];
  }
};

export const saveTransaction = async (transaction) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return;
    const key = `@pocket_money_transactions_${currentUser}`;
    const existingTransactions = await getTransactions();
    const newTransactions = [transaction, ...existingTransactions];
    await AsyncStorage.setItem(key, JSON.stringify(newTransactions));
    return newTransactions;
  } catch (e) {}
};

export const updateTransaction = async (updatedItem) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return;
    const key = `@pocket_money_transactions_${currentUser}`;
    const existingTransactions = await getTransactions();
    const newTransactions = existingTransactions.map((item) =>
      item.id === updatedItem.id ? updatedItem : item,
    );
    await AsyncStorage.setItem(key, JSON.stringify(newTransactions));
    return newTransactions;
  } catch (e) {}
};

export const deleteTransaction = async (id) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return;
    const key = `@pocket_money_transactions_${currentUser}`;
    const existingTransactions = await getTransactions();
    const filteredTransactions = existingTransactions.filter(
      (item) => item.id !== id,
    );
    await AsyncStorage.setItem(key, JSON.stringify(filteredTransactions));
    return filteredTransactions;
  } catch (e) {}
};
