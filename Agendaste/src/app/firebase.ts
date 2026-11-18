import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import { environment } from '../environments/environment';

// Inicialização do Firebase
export const firebaseApp = initializeApp(
  environment.firebaseConfig
);

// Autenticação
export const auth = getAuth(firebaseApp);

// Banco de dados
export const db = getFirestore(firebaseApp);
