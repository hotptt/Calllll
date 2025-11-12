import React, { useState, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

// 1,000원 단위 내림
const floorToK = (v) => Math.floor(v / 1000) * 1000;

// 앞 두 자리만 자릿수에 맞춰 한글로 요약
// 규칙:
// - 1만 미만: 표시 안 함(호출 전에서 거름)
// - 1만 ~ 9만: "약 X만 원대"
// - 10만 ~ 99만: "약 XY만 원대" (예: 34만 → 34만 원대)
// - 100만 ~ 999만: 앞 두 자리만 남기고 0 채움 (348만 → 340만 원대)
// - 1천만 ~ 9천9백만: 앞 두 자리만 남기고 00 채움 (5670만 → 5600만 원대)
// - 1억 이상: "약 A억B천만 원대" (B가 0이면 "약 A억 원대")
const formatApproxKR = (totalWon) => {
  if (!Number.isFinite(totalWon) || totalWon < 10000) return '';

  const man = Math.floor(totalWon / 10000); // '만' 단위 정수

  // 1억 이상 (>= 100,000,000원 = 10,000만)
  if (man >= 10000) {
    const eok = Math.floor(totalWon / 100000000);              // 억
    const chun = Math.floor((totalWon % 100000000) / 10000000); // 천만 자리(0~9)
    return `약 ${eok}억${chun ? `${chun}천` : ''}만 원대`;
  }

  // 1천만 ~ 9천9백만 (1000만~9999만)
  if (man >= 1000) {
    const approx = Math.floor(man / 100) * 100; // 앞 두 자리만 남기고 00
    return `약 ${approx}만 원대`;
  }

  // 100만 ~ 999만
  if (man >= 100) {
    const approx = Math.floor(man / 10) * 10; // 앞 두 자리만 남기고 0
    return `약 ${approx}만 원대`;
  }

  // 10만 ~ 99만
  if (man >= 10) {
    return `약 ${man}만 원대`; // 이미 두 자리
  }

  // 1만 ~ 9만
  return `약 ${man}만 원대`;
};

export default function App() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [times, setTimes] = useState('');

  const [totalReturn, setTotalReturn] = useState(''); // "12%" 등
  const [totalAmount, setTotalAmount] = useState(''); // "1,230,000원"
  const [summary, setSummary] = useState('');         // "약 120만 원대" 등

  const calculate = () => {
    const r = parseFloat(String(rate).replace(/,/g, '')) / 100;
    const n = parseInt(String(times).replace(/,/g, ''), 10);

    if (!Number.isFinite(r) || !Number.isFinite(n)) {
      setTotalReturn('입력값 오류');
      setTotalAmount('');
      setSummary('');
      return;
    }

    const growth = Math.pow(1 + r, n);
    const returnPercent = Math.round((growth - 1) * 100);
    setTotalReturn(`${returnPercent}%`);

    const p = parseFloat(String(principal).replace(/,/g, ''));
    if (Number.isFinite(p)) {
      const total = floorToK(p * growth);

      // 1만 미만은 표시 안 함
      if (total < 10000) {
        setTotalAmount('');
        setSummary('');
        return;
      }

      const formatted = new Intl.NumberFormat('ko-KR').format(total) + '원';
      setTotalAmount(formatted);
      setSummary(formatApproxKR(total));
    } else {
      // 원금이 없으면 금액/요약 비움(수익률만)
      setTotalAmount('');
      setSummary('');
    }
  };

  const showResults = useMemo(() => totalReturn !== '', [totalReturn]);
  const hasAmount = useMemo(() => totalAmount !== '', [totalAmount]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Text style={styles.title}>계산기</Text>

        <TextInput
          style={[styles.input, { color: '#777' }]}
          placeholder="원금(선택)"
          keyboardType="numeric"
          value={principal}
          onChangeText={setPrincipal}
        />
        <TextInput
          style={[styles.input, { color: '#777' }]}
          placeholder="수익률(%)"
          keyboardType="numeric"
          value={rate}
          onChangeText={setRate}
        />
        <TextInput
          style={[styles.input, { color: '#777' }]}
          placeholder="반복 횟수"
          keyboardType="numeric"
          value={times}
          onChangeText={setTimes}
        />

        <TouchableOpacity style={styles.button} onPress={calculate}>
          <Text style={styles.buttonText}>"세상이 알아주는 건 노력 말고 결과야"</Text>
        </TouchableOpacity>

        {showResults && (
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>총 수익률: {totalReturn}</Text>
            {hasAmount ? (
              <>
                <Text style={styles.resultText}>총 금액: {totalAmount}</Text>
                {summary ? <Text style={styles.summaryText}>{summary}</Text> : null}
              </>
            ) : null}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    width: 300,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    paddingHorizontal: 24,
  },
  resultBox: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 300,
  },
  resultText: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 3,
  },
  summaryText: {
    fontSize: 15,
    color: '#555',
    marginTop: 4,
  },
});
