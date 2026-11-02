import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { PrimaryButton } from '../components/PrimaryButton';
import { Notice } from '../components/Notice';
import { colors } from '../styles/theme';
import { emailValido, normalizarEmail, validarCadastro, validarLogin } from '../utils/validation';
import { mensagemDeErro } from '../utils/errors';

export function AuthScreen() {
  const [modo, setModo] = useState('entrar');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);

  function mudarModo(novoModo) {
    setModo(novoModo);
    setSenha('');
    setConfirmacao('');
    setNotice(null);
  }

  async function enviar(event) {
    if (busy) return;
    const emailLimpo = normalizarEmail(email);
    const erro = modo === 'cadastro'
      ? validarCadastro(emailLimpo, senha, confirmacao)
      : modo === 'entrar'
        ? validarLogin(emailLimpo, senha)
        : emailValido(emailLimpo) ? null : 'Digite um e-mail válido.';

    if (erro) {
      setNotice({ kind: 'error', message: erro });
      return;
    }

    setNotice(null);
    setBusy(true);
    try {
      if (modo === 'cadastro') {
        await createUserWithEmailAndPassword(auth, emailLimpo, senha);
      } else if (modo === 'entrar') {
        await signInWithEmailAndPassword(auth, emailLimpo, senha);
      } else {
        await sendPasswordResetEmail(auth, emailLimpo);
        setNotice({ kind: 'success', message: 'Se houver uma conta com esse e-mail, você receberá instruções para redefinir a senha. Confira também o spam.' });
      }
    } catch (error) {
      setNotice({ kind: 'error', message: mensagemDeErro(error) });
    } finally {
      setBusy(false);
    }
  }

  const titulo = modo === 'cadastro' ? 'Crie sua conta' : modo === 'recuperar' ? 'Recupere o acesso' : 'Bem-vindo de volta';
  const subtitulo = modo === 'cadastro'
    ? 'Salve suas tarefas e acesse sua lista de qualquer lugar.'
    : modo === 'recuperar'
      ? 'Enviaremos um link para o seu e-mail.'
      : 'Organize seu dia, uma tarefa de cada vez.';

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <View style={styles.logo}><Text style={styles.logoMark}>✓</Text></View>
          <Text style={styles.brand}>FocusList<Text style={styles.dot}>.</Text></Text>
          <Text style={styles.heroCaption}>Seu tempo, suas conquistas.</Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.title}>{titulo}</Text>
          <Text style={styles.subtitle}>{subtitulo}</Text>

          <Notice message={notice?.message} kind={notice?.kind} />

          <Text style={styles.label}>E-MAIL</Text>
          <TextInput
            style={styles.input}
            placeholder="voce@exemplo.com"
            placeholderTextColor="#93A0B4"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            value={email}
            onChangeText={setEmail}
            editable={!busy}
          />

          {modo !== 'recuperar' && (
            <>
              <Text style={styles.label}>SENHA</Text>
              <TextInput
                style={styles.input}
                placeholder="Mínimo de 6 caracteres"
                placeholderTextColor="#93A0B4"
                secureTextEntry
                textContentType={modo === 'cadastro' ? 'newPassword' : 'password'}
                value={senha}
                onChangeText={setSenha}
                editable={!busy}
              />
            </>
          )}

          {modo === 'cadastro' && (
            <>
              <Text style={styles.label}>CONFIRMAR SENHA</Text>
              <TextInput
                style={styles.input}
                placeholder="Repita sua senha"
                placeholderTextColor="#93A0B4"
                secureTextEntry
                textContentType="newPassword"
                value={confirmacao}
                onChangeText={setConfirmacao}
                editable={!busy}
              />
            </>
          )}

          {modo === 'entrar' && (
            <Pressable onPress={() => mudarModo('recuperar')} style={styles.forgot} disabled={busy}>
              <Text style={styles.link}>Esqueci minha senha</Text>
            </Pressable>
          )}

          <PrimaryButton
            title={modo === 'cadastro' ? 'Criar conta' : modo === 'recuperar' ? 'Enviar recuperação' : 'Entrar na minha lista'}
            onPress={enviar}
            loading={busy}
          />

          <View style={styles.footer}>
            {modo === 'entrar' ? (
              <><Text style={styles.footText}>Ainda não tem conta? </Text><Pressable onPress={() => mudarModo('cadastro')}><Text style={styles.link}>Cadastre-se</Text></Pressable></>
            ) : (
              <><Text style={styles.footText}>Já possui uma conta? </Text><Pressable onPress={() => mudarModo('entrar')} disabled={busy}><Text style={styles.link}>Voltar ao login</Text></Pressable></>
            )}
          </View>
        </View>
        <Text style={styles.bottom}>CP3 • React Native + Firebase</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.navy },
  page: { flexGrow: 1, paddingHorizontal: 22, paddingTop: 55, paddingBottom: 36, justifyContent: 'center' },
  hero: { alignItems: 'center', marginBottom: 36 },
  logo: { width: 64, height: 64, borderRadius: 21, backgroundColor: colors.blue, justifyContent: 'center', alignItems: 'center', marginBottom: 17 },
  logoMark: { color: colors.white, fontSize: 38, fontWeight: '900' },
  brand: { fontSize: 36, fontWeight: '900', color: colors.white, letterSpacing: -1.6 },
  dot: { color: '#77C6FF' },
  heroCaption: { color: '#B9C9E4', marginTop: 6, fontSize: 14 },
  panel: { backgroundColor: colors.white, borderRadius: 24, padding: 24 },
  title: { fontSize: 25, fontWeight: '900', color: colors.ink, letterSpacing: -0.6 },
  subtitle: { fontSize: 14, lineHeight: 21, color: colors.muted, marginTop: 7, marginBottom: 24 },
  label: { color: colors.ink, fontSize: 11, fontWeight: '900', letterSpacing: 1.1, marginBottom: 8 },
  input: { minHeight: 50, backgroundColor: colors.bg, borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, marginBottom: 19, color: colors.ink, fontSize: 15 },
  forgot: { alignSelf: 'flex-end', marginBottom: 22, marginTop: -4 },
  link: { color: colors.blue, fontSize: 13, fontWeight: '800' },
  footer: { marginTop: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' },
  footText: { color: colors.muted, fontSize: 13 },
  bottom: { textAlign: 'center', marginTop: 28, color: '#93A6C5', fontSize: 11 },
});
