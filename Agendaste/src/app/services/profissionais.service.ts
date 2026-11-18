
import { Injectable } from '@angular/core';

import {
    createUserWithEmailAndPassword,
    deleteUser,
    signOut
} from 'firebase/auth';

import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp
} from 'firebase/firestore';

import { auth, db } from '../firebase';

// Dados utilizados no cadastro
export interface CadastroProfissional {
    nome: string;
    email: string;
    celular: string;
    profissao: string;
    especialidade: string;
    senha: string;
}

// Dados que podem ser editados
export interface AtualizacaoPerfilProfissional {
    nome: string;
    celular: string;
    profissao: string;
    especialidade: string;
    horarioInicio: string;
    horarioFim: string;
    tipoConselho: string;
    ufConselho: string;
    numeroRegistro: string;
}

// Perfil completo do profissional
export interface PerfilProfissional
    extends AtualizacaoPerfilProfissional {

    uid: string;
    email: string;
}

@Injectable({
    providedIn: 'root'
})
export class ProfissionaisService {

    // ======================================
    // CADASTRAR PROFISSIONAL
    // ======================================

    async cadastrar(
        dados: CadastroProfissional
    ): Promise<void> {

        const credencial = await createUserWithEmailAndPassword(
            auth,
            dados.email,
            dados.senha
        );

        const uid = credencial.user.uid;

        try {

            await setDoc(doc(db, 'profissionais', uid), {
                nome: dados.nome,
                email: dados.email,
                celular: dados.celular,
                profissao: dados.profissao,
                especialidade: dados.especialidade,
                criadoEm: serverTimestamp()
            });

        } catch (erro) {

            try {
                await deleteUser(credencial.user);
            } catch (erroExclusao) {
                console.error(
                    'Erro ao desfazer cadastro:',
                    erroExclusao
                );
            }

            throw erro;
        }

        await signOut(auth);
    }

    // ======================================
    // BUSCAR PERFIL ATUAL
    // ======================================

    async obterPerfilAtual(): Promise<PerfilProfissional> {

        await auth.authStateReady();

        const usuario = auth.currentUser;

        if (!usuario) {
            throw new Error('Usuário não autenticado.');
        }

        const referencia = doc(
            db,
            'profissionais',
            usuario.uid
        );

        const documento = await getDoc(referencia);

        if (!documento.exists()) {
            throw new Error(
                'Perfil profissional não encontrado.'
            );
        }

        const dados = documento.data();

        return {
            uid: usuario.uid,
            nome: dados['nome'] ?? '',
            email: dados['email'] ?? '',
            celular: dados['celular'] ?? '',
            profissao: dados['profissao'] ?? '',
            especialidade: dados['especialidade'] ?? '',

            // Campos opcionais do perfil
            horarioInicio: dados['horarioInicio'] ?? '',
            horarioFim: dados['horarioFim'] ?? '',
            tipoConselho: dados['tipoConselho'] ?? '',
            ufConselho: dados['ufConselho'] ?? '',
            numeroRegistro: dados['numeroRegistro'] ?? ''
        };
    }

    // ======================================
    // ATUALIZAR PERFIL ATUAL
    // ======================================

    async atualizarPerfilAtual(
        dados: AtualizacaoPerfilProfissional
    ): Promise<void> {

        await auth.authStateReady();

        const usuario = auth.currentUser;

        if (!usuario) {
            throw new Error('Usuário não autenticado.');
        }

        const referencia = doc(
            db,
            'profissionais',
            usuario.uid
        );

        await updateDoc(referencia, {
            nome: dados.nome,
            celular: dados.celular,
            profissao: dados.profissao,
            especialidade: dados.especialidade,
            horarioInicio: dados.horarioInicio,
            horarioFim: dados.horarioFim,
            tipoConselho: dados.tipoConselho,
            ufConselho: dados.ufConselho,
            numeroRegistro: dados.numeroRegistro
        });

    }
}
