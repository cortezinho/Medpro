// src/screens/Medico/CadastroEdicaoMedicoScreen.js
import React from 'react';
import { Alert } from 'react-native';
import MedicoForm from '../../components/MedicoForm';
import api from '../../services/api';

const normalizeToEnum = (s) => {
  if (!s) return s;
  // remove acentos e transforma em maiúsculas (ex: "Ginecologia" -> "GINECOLOGIA")
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
};

const CadastroEdicaoMedicoScreen = ({ route, navigation }) => {
  const { medico } = route.params || {};

  const montarPayloadCadastro = (dados) => {
    return {
      nome: dados.nome,
      email: dados.email,
      telefone: dados.telefone,
      crm: dados.crm,
      especialidade: normalizeToEnum(dados.especialidade),
      endereco: {
        logradouro: dados.logradouro,
        numero: dados.numero,
        complemento: dados.complemento || '',
        cidade: dados.cidade,
        uf: dados.uf,
        cep: dados.cep
      }
    };
  };

  const montarPayloadAtualizacao = (dados, id) => {
    // O DTO de atualização no backend costuma aceitar id + campos mutáveis.
    return {
      id: id,
      nome: dados.nome,
      telefone: dados.telefone,
      endereco: {
        logradouro: dados.logradouro,
        numero: dados.numero,
        complemento: dados.complemento || '',
        cidade: dados.cidade,
        uf: dados.uf,
        cep: dados.cep
      }
    };
  };

  const handleSave = async (dados) => {
    try {
      if (medico && medico.id) {
        // EDITAR
        const payload = montarPayloadAtualizacao(dados, medico.id);
        await api.put('/medicos', payload);
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso.');
      } else {
        // CADASTRAR
        const payload = montarPayloadCadastro(dados);
        await api.post('/medicos', payload);
        Alert.alert('Sucesso', 'Médico cadastrado com sucesso.');
      }

      // volta para a lista; a Op1Screen foi ajustada para recarregar ao ganhar foco
      navigation.goBack();
    } catch (error) {
      console.log('Erro ao salvar médico:', error?.response ?? error);
      const msg = error?.response?.data?.message || 'Erro ao salvar. Verifique os campos e tente novamente.';
      Alert.alert('Erro', msg);
    }
  };

  const handleCancel = () => navigation.goBack();

  return (
    <MedicoForm
      medico={medico}
      onSave={handleSave}
      onCancel={handleCancel}
      navigation={navigation}
    />
  );
};

export default CadastroEdicaoMedicoScreen;