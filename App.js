import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, firebaseConfigurado } from './src/config/firebase';
import { AuthScreen } from './src/screens/AuthScreen';
import { TasksScreen } from './src/screens/TasksScreen';
import { colors } from './src/styles/theme';

function AppContent() {
  const [user, setUser] = useState(null);
  const [carregandoSessao, setCarregandoSessao] = useState(true);

  useEffect(() => {
    if (!auth) {
      setCarregandoSessao(false);
      return;
    }
    // Escuta quando o usuário faz login, logout ou quando a sessão é restaurada.
    const unsubscribe = onAuthStateChanged(auth, (usuario) => {
      setUser(usuario);
      setCarregandoSessao(false);
    });
    return () => unsubscribe();
  }, []);

  if (!firebaseConfigurado) {
    return (
      <SafeAreaView style={styles.configScreen}>
        <Text style={styles.configTitle}>Configuração necessária</Text>
        <Text style={styles.configMessage}>Preencha o arquivo .env com as informações do seu projeto Firebase e reinicie o Expo. Consulte o README.md.</Text>
      </SafeAreaView>
    );
  }

  if (carregandoSessao) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.blue} />
        <Text style={styles.loadingText}>Preparando seu FocusList...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {user ? <TasksScreen user={user} /> : <AuthScreen />}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  loadingText: { fontSize: 14, color: colors.muted, marginTop: 18 },
  configScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30, backgroundColor: colors.bg },
  configTitle: { fontSize: 22, fontWeight: '900', color: colors.ink, textAlign: 'center' },
  configMessage: { textAlign: 'center', fontSize: 15, color: colors.muted, lineHeight: 23, marginTop: 15 },
});
