import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export default function RootLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#2ECC71' }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'เข้าสู่ระบบ',
          headerTitle: 'ระบบเข้าสู่ระบบ / โปรไฟล์',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="home" 
        options={{ 
          title: 'หน้าแรก',
          headerTitle: 'PocketMoney - บัญชีของฉัน',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="add" 
        options={{ 
          title: 'เพิ่ม/จัดการ',
          headerTitle: 'เพิ่ม แก้ไข และลบรายการ',
          tabBarIcon: ({ color, size }) => <Ionicons name="create" size={size} color={color} />
        }} 
      />
      <Tabs.Screen name="detail" options={{ href: null }} />
      <Tabs.Screen name="edit" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}