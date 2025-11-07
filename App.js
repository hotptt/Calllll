import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [times, setTimes] = useState("");
  const [totalReturn, setTotalReturn] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);

  const calculate = () => {
    const r = parseFloat(rate) / 100;
    const n = parseInt(times);
    if (isNaN(r) || isNaN(n)) {
      setTotalReturn("입력값 오류");
      setTotalAmount(null);
      return;
    }
    const growth = Math.pow(1 + r, n);
    setTotalReturn(((growth - 1) * 100).toFixed(2) + "%");

    const p = parseFloat(principal);
    if (!isNaN(p)) setTotalAmount(new Intl.NumberFormat("ko-KR").format(p * growth) + "원");
    else setTotalAmount(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Text style={styles.title}>수익률 계산기</Text>

        <TextInput style={styles.input} placeholder="원금 (선택)  예: 1000000" keyboardType="numeric" value={principal} onChangeText={setPrincipal} />
        <TextInput style={styles.input} placeholder="수익률(%)  예: 2" keyboardType="numeric" value={rate} onChangeText={setRate} />
        <TextInput style={styles.input} placeholder="반복 횟수  예: 5" keyboardType="numeric" value={times} onChangeText={setTimes} />

        <TouchableOpacity style={styles.button} onPress={calculate}>
          <Text style={styles.buttonText}>계산하기</Text>
        </TouchableOpacity>

        {totalReturn && (
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>총 수익률: {totalReturn}</Text>
            {totalAmount && <Text style={styles.resultText}>총 금액: {totalAmount}</Text>}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f8fa", justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#333", textAlign: "center" },
  input: { width: 300, padding: 12, borderWidth: 1, borderColor: "#ccc", borderRadius: 10, marginBottom: 10, backgroundColor: "#fff" },
  button: { backgroundColor: "#007AFF", paddingVertical: 12, borderRadius: 10, marginTop: 5 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold", fontSize: 16, paddingHorizontal: 24 },
  resultBox: { marginTop: 20, backgroundColor: "#fff", padding: 15, borderRadius: 10, alignItems: "center", minWidth: 300 },
  resultText: { fontSize: 16, fontWeight: "500", marginVertical: 3 }
});