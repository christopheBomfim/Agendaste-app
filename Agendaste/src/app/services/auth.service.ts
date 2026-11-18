import { Injectable } from '@angular/core';
import { signInWithEmailAndPassword, signOut} from 'firebase/auth';
import { doc, getDoc} from 'firebase/firestore';
import { auth, db } from '../firebase';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    // Login do profissional
    async entrar(
        email: string,
        senha: string
    ): Promise<void> {

        // Autenticar no Firebase Authentication
        const credencial = await signInWithEmailAndPassword(
            auth,
            email.trim().toLowerCase(),
            senha
        );

        try {

            // Verificar se o perfil existe no Firestore
            const referencia = doc(
                db,
                'profissionais',
                credencial.user.uid
            );

            const documento = await getDoc(referencia);

            if (!documento.exists()) {
                throw new Error('perfil-profissional-ausente');
            }

        } catch (erro) {

            // Não manter a sessão se não for possível
            // validar o perfil profissional
            await signOut(auth);
            throw erro;
        }
    }

    // Encerrar sessão
    async sair(): Promise<void> {
        await signOut(auth);
    }
}
