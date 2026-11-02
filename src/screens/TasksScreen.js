import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Notice } from '../components/Notice';
import { PrimaryButton } from '../components/PrimaryButton';
import { adicionarTarefa, alternarConclusao, observarTarefas, removerTarefa } from '../services/tasks';
import { colors } from '../styles/theme';
import { mensagemDeErro } from '../utils/errors';
import { filtrarTarefas, validarTarefa } from '../utils/validation';

const filtros = [
  { id: 'todas', label: 'Todas' },
  { id: 'pendentes', label: 'Pendentes' },
  { id: 'concluidas', label: 'Concluídas' },
];

function TaskCard({ tarefa, onToggle, onDelete, busy }) {
  return (
    <View style={styles.taskCard}>
      <Pressable
        style={[styles.checkbox, tarefa.completed && styles.checkboxChecked]}
        onPress={() => onToggle(tarefa)}
        disabled={busy}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: tarefa.completed, disabled: busy }}
        accessibilityLabel={`Marcar tarefa: ${tarefa.title}`}
      >
        {tarefa.completed && <Text style={styles.tick}>✓</Text>}
      </Pressable>
      <Pressable style={styles.taskContent} onPress={() => onToggle(tarefa)} disabled={busy}>
        <Text style={[styles.taskTitle, tarefa.completed && styles.done]}>{tarefa.title}</Text>
        <Text style={styles.taskHint}>{tarefa.completed ? 'Concluída' : 'Em andamento'}</Text>
      </Pressable>
      <Pressable
        style={styles.deleteButton}
        onPress={() => onDelete(tarefa)}
        disabled={busy}
        accessibilityRole="button"
        accessibilityLabel={`Excluir tarefa ${tarefa.title}`}
      >
        {busy ? <ActivityIndicator size="small" color={colors.blue} /> : <Text style={styles.deleteLabel}>Excluir</Text>}
      </Pressable>
    </View>
  );
}

export function TasksScreen({ user }) {
  const [tarefas, setTarefas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [filtro, setFiltro] = useState('todas');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [signingOut, setSigningOut] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    setLoading(true);
    setTarefas([]);
    setNotice(null);
    // Inscrição ativada na montagem e cancelada ao sair/trocar de usuário.
    const unsubscribe = observarTarefas(
      user.uid,
      (lista) => {
        setTarefas(lista);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        setNotice({ kind: 'error', message: mensagemDeErro(error) });
      },
    );
    return () => unsubscribe();
  }, [user.uid]);

  const concluidas = tarefas.filter((item) => item.completed).length;
  const pendentes = tarefas.length - concluidas;
  const visiveis = useMemo(() => filtrarTarefas(tarefas, filtro), [tarefas, filtro]);

  async function criar() {
    if (saving) return;
    const erro = validarTarefa(titulo);
    if (erro) {
      setNotice({ kind: 'error', message: erro });
      return;
    }
    setSaving(true);
    setNotice(null);
    try {
      await adicionarTarefa(user.uid, titulo);
      setTitulo('');
      Keyboard.dismiss();
      setNotice({ kind: 'success', message: 'Tarefa adicionada com sucesso!' });
    } catch (error) {
      setNotice({ kind: 'error', message: mensagemDeErro(error) });
    } finally {
      setSaving(false);
    }
  }

  async function alternar(tarefa) {
    if (busyId) return;
    setBusyId(tarefa.id);
    setNotice(null);
    try {
      await alternarConclusao(user.uid, tarefa.id, !tarefa.completed);
    } catch (error) {
      setNotice({ kind: 'error', message: mensagemDeErro(error) });
    } finally {
      setBusyId(null);
    }
  }

  function confirmarExclusao(tarefa) {
    if (busyId) return;
    Alert.alert('Excluir tarefa?', `Deseja excluir "${tarefa.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          setBusyId(tarefa.id);
          setNotice(null);
          try {
            await removerTarefa(user.uid, tarefa.id);
            setNotice({ kind: 'success', message: 'Tarefa excluída.' });
          } catch (error) {
            setNotice({ kind: 'error', message: mensagemDeErro(error) });
          } finally {
            setBusyId(null);
          }
        },
      },
    ]);
  }

  async function sair() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await signOut(auth);
    } catch (error) {
      setNotice({ kind: 'error', message: mensagemDeErro(error) });
      setSigningOut(false);
    }
  }

  return (
    <View style={styles.page}>
      <FlatList
        data={visiveis}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TaskCard tarefa={item} busy={busyId !== null} onToggle={alternar} onDelete={confirmarExclusao} />
        )}
        ListHeaderComponent={
          <>
            <View style={styles.topBar}>
              <View>
                <Text style={styles.topBrand}>FocusList<Text style={styles.brandDot}>.</Text></Text>
                <Text style={styles.topCaption}>Seu espaço de produtividade</Text>
              </View>
              <Pressable onPress={sair} style={styles.logout} disabled={signingOut} accessibilityRole="button" accessibilityLabel="Sair da conta">
                <Text style={styles.logoutText}>{signingOut ? 'Saindo...' : 'Sair'}</Text>
              </Pressable>
            </View>

            <View style={styles.intro}>
              <Text style={styles.greeting}>Olá, tudo bem? 👋</Text>
              <Text style={styles.email} numberOfLines={1}>{user.email}</Text>
              <Text style={styles.headline}>Vamos colocar suas ideias em ação.</Text>
            </View>

            <View style={styles.stats}>
              <View style={styles.statBlock}><Text style={styles.statNumber}>{tarefas.length}</Text><Text style={styles.statLabel}>Total</Text></View>
              <View style={styles.statDivider} />
              <View style={styles.statBlock}><Text style={styles.statNumber}>{pendentes}</Text><Text style={styles.statLabel}>Pendentes</Text></View>
              <View style={styles.statDivider} />
              <View style={styles.statBlock}><Text style={styles.statNumber}>{concluidas}</Text><Text style={styles.statLabel}>Concluídas</Text></View>
            </View>

            <Text style={styles.sectionTitle}>Nova tarefa</Text>
            <View style={styles.formCard}>
              <TextInput
                style={styles.taskInput}
                placeholder="Ex.: Estudar para a FIAP"
                placeholderTextColor="#9AA6B8"
                value={titulo}
                onChangeText={setTitulo}
                maxLength={101}
                editable={!saving}
                returnKeyType="done"
                onSubmitEditing={criar}
              />
              <PrimaryButton title="+ Adicionar tarefa" onPress={criar} loading={saving} />
            </View>

            <Notice message={notice?.message} kind={notice?.kind} />

            <View style={styles.listTitleRow}>
              <Text style={styles.sectionTitle}>Minhas tarefas</Text>
              <Text style={styles.quantity}>{visiveis.length} item(ns)</Text>
            </View>
            <View style={styles.tabs}>
              {filtros.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => setFiltro(item.id)}
                  style={[styles.tab, filtro === item.id && styles.selectedTab]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: filtro === item.id }}
                >
                  <Text style={[styles.tabText, filtro === item.id && styles.selectedTabText]}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
          </>
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.empty}><ActivityIndicator color={colors.blue} size="large" /><Text style={styles.emptyText}>Carregando suas tarefas...</Text></View>
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>{filtro === 'concluidas' ? '🏆' : '🗒️'}</Text>
              <Text style={styles.emptyTitle}>{tarefas.length === 0 ? 'Sua lista começa aqui' : 'Nenhuma tarefa nesse filtro'}</Text>
              <Text style={styles.emptyText}>{tarefas.length === 0 ? 'Cadastre sua primeira tarefa acima.' : 'Selecione outro filtro para visualizar suas tarefas.'}</Text>
            </View>
          )
        }
        ListFooterComponent={<Text style={styles.footer}>Um passo por vez. Você consegue! ✨</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  listContainer: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 35, flexGrow: 1 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 },
  topBrand: { color: colors.ink, fontSize: 23, fontWeight: '900', letterSpacing: -0.7 },
  brandDot: { color: colors.blue },
  topCaption: { color: colors.muted, fontSize: 11, marginTop: 1 },
  logout: { backgroundColor: colors.white, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 15, borderWidth: 1, borderColor: colors.border },
  logoutText: { color: colors.blue, fontWeight: '800', fontSize: 13 },
  intro: { marginBottom: 22 },
  greeting: { fontSize: 16, fontWeight: '800', color: colors.ink },
  email: { color: colors.muted, fontSize: 12, marginTop: 2 },
  headline: { fontSize: 28, fontWeight: '900', letterSpacing: -0.8, color: colors.ink, lineHeight: 35, marginTop: 17, maxWidth: 330 },
  stats: { flexDirection: 'row', backgroundColor: colors.navy, borderRadius: 20, paddingVertical: 21, marginBottom: 29, alignItems: 'center' },
  statBlock: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 26, fontWeight: '900', color: colors.white },
  statLabel: { fontSize: 11, color: '#B2C5E4', marginTop: 4 },
  statDivider: { width: 1, height: 36, backgroundColor: '#3B506C' },
  sectionTitle: { fontSize: 19, fontWeight: '900', color: colors.ink },
  formCard: { backgroundColor: colors.white, padding: 15, marginTop: 12, borderRadius: 18, marginBottom: 24, borderWidth: 1, borderColor: colors.border },
  taskInput: { color: colors.ink, minHeight: 50, fontSize: 15, paddingHorizontal: 9, marginBottom: 7 },
  listTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13 },
  quantity: { fontSize: 12, color: colors.muted },
  tabs: { flexDirection: 'row', gap: 7, marginBottom: 17 },
  tab: { backgroundColor: '#E8EDF5', borderRadius: 10, paddingVertical: 11, paddingHorizontal: 13, flex: 1, alignItems: 'center' },
  selectedTab: { backgroundColor: colors.blue },
  tabText: { color: colors.muted, fontWeight: '700', fontSize: 11 },
  selectedTabText: { color: colors.white },
  taskCard: { backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1, borderRadius: 15, marginBottom: 10, padding: 14, minHeight: 76, flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkbox: { width: 25, height: 25, borderRadius: 8, borderWidth: 2, borderColor: '#B8C5D8', alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: colors.green, borderColor: colors.green },
  tick: { fontWeight: '900', color: colors.white, fontSize: 14 },
  taskContent: { flex: 1 },
  taskTitle: { fontWeight: '800', color: colors.ink, fontSize: 14, lineHeight: 20 },
  done: { textDecorationLine: 'line-through', color: '#9BA8BA' },
  taskHint: { color: colors.muted, fontSize: 11, marginTop: 4 },
  deleteButton: { paddingVertical: 8, paddingHorizontal: 3 },
  deleteLabel: { color: colors.red, fontSize: 12, fontWeight: '800' },
  empty: { backgroundColor: colors.white, padding: 29, alignItems: 'center', borderRadius: 16, marginTop: 4, borderWidth: 1, borderColor: colors.border },
  emptyEmoji: { fontSize: 36, marginBottom: 12 },
  emptyTitle: { textAlign: 'center', color: colors.ink, fontWeight: '900', fontSize: 16 },
  emptyText: { textAlign: 'center', color: colors.muted, marginTop: 8, fontSize: 13, lineHeight: 19 },
  footer: { textAlign: 'center', fontSize: 12, color: colors.muted, marginTop: 29 },
});
