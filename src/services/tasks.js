import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Cada usuário tem sua própria subcoleção:
// users/{uid}/tasks/{id}
function caminhoDeTarefas(uid) {
  return collection(db, 'users', uid, 'tasks');
}

export function observarTarefas(uid, onSuccess, onError) {
  const consulta = query(caminhoDeTarefas(uid), orderBy('createdAt', 'desc'));
  // onSnapshot escuta o Firestore em tempo real e devolve uma função de cancelamento.
  return onSnapshot(
    consulta,
    (snapshot) => {
      const tarefas = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));
      onSuccess(tarefas);
    },
    onError,
  );
}

export async function adicionarTarefa(uid, titulo) {
  await addDoc(caminhoDeTarefas(uid), {
    title: titulo.trim(),
    completed: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function alternarConclusao(uid, id, completed) {
  await updateDoc(doc(db, 'users', uid, 'tasks', id), {
    completed,
    updatedAt: serverTimestamp(),
  });
}

export async function removerTarefa(uid, id) {
  await deleteDoc(doc(db, 'users', uid, 'tasks', id));
}
