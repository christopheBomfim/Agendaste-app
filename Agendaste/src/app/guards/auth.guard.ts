import { inject } from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import { signOut } from 'firebase/auth';
import {doc, getDoc} from 'firebase/firestore';
import { auth, db } from '../firebase';

export const authGuard: CanActivateFn = async () => {

  const router = inject(Router);

  try {

    // 1. Aguardar a inicialização do Firebase Authentication
    await auth.authStateReady();

    // 2. Verificar se existe usuário autenticado
    const usuario = auth.currentUser;

    if (!usuario) {
      return router.createUrlTree(['/login']);
    }

    // 3. Procurar perfil profissional no Firestore
    const referencia = doc(
      db,
      'profissionais',
      usuario.uid
    );

    const documento = await getDoc(referencia);

    // 4. Verificar se o perfil profissional existe
    if (!documento.exists()) {

      // Encerrar sessão de usuário sem perfil profissional
      await signOut(auth);

      return router.createUrlTree(['/login']);
    }

    // 5. Liberar acesso
    return true;

  } catch (erro) {

    console.error(
      'Erro ao verificar autenticação:',
      erro
    );

    // Não liberar acesso se a verificação falhar
    return router.createUrlTree(['/login']);
  }

};
