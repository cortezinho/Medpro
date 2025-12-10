import React from 'react';
import { Alert } from 'react-native';
import MedicoForm from '../../components/MedicoForm';
import api from '../../services/api';

const normalizeToEnum = (s) => {
  if (!s) return s;
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
        bairro: dados.bairro, // Adicionado pois é obrigatório
        cidade: dados.cidade,
        uf: dados.uf,
        cep: dados.cep
      }
    };
  };

  const montarPayloadAtualizacao = (dados, id) => {
    return {
      id: id,
      nome: dados.nome,
      telefone: dados.telefone,
      endereco: {
        logradouro: dados.logradouro,
        numero: dados.numero,
        complemento: dados.complemento || '',
        bairro: dados.bairro,
        cidade: dados.cidade,
        uf: dados.uf,
        cep: dados.cep
      }
    };
  };

  const handleSave = async (dados) => {
    try {
      if (medico && medico.id) {
        // EDITAR (PUT)
        const payload = montarPayloadAtualizacao(dados, medico.id);
        await api.put('/medicos', payload);
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso.');
      } else {
        // CADASTRAR (POST) - Rota corrigida para /medicos/cadastro
        const payload = montarPayloadCadastro(dados);
        await api.post('/medicos/cadastro', payload);
        Alert.alert('Sucesso', 'Médico cadastrado com sucesso.');
      }

      navigation.goBack();
    } catch (error) {
      console.log('Erro ao salvar médico:', error?.response ?? error);
      // Mostra mensagem mais detalhada se houver
      const msg = error?.response?.data?.message || JSON.stringify(error?.response?.data) || 'Erro ao salvar.';
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