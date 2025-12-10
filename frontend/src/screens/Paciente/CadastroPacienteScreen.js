import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import api from '../../services/api';

const CadastroPacienteScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    cep: ''
  });

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSalvar = async () => {
    // Validação simples
    if (!formData.nome || !formData.cpf || !formData.email) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios (Nome, CPF, Email).');
      return;
    }

    const payload = {
      nome: formData.nome,
      email: formData.email,
      telefone: formData.telefone,
      cpf: formData.cpf,
      endereco: {
        logradouro: formData.logradouro,
        numero: formData.numero,
        complemento: formData.complemento,
        bairro: formData.bairro,
        cidade: formData.cidade,
        uf: formData.uf,
        cep: formData.cep
      }
    };

    try {
      await api.post('/pacientes/cadastro', payload);
      Alert.alert('Sucesso', 'Paciente cadastrado!');
      navigation.goBack();
    } catch (error) {
      const msg = error.response?.data?.message || 'Erro ao cadastrar paciente.';
      Alert.alert('Erro', msg);
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Novo Paciente</Text>

        <Text style={styles.label}>Dados Pessoais</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Nome Completo" 
          value={formData.nome} 
          onChangeText={t => handleChange('nome', t)} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Email" 
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email} 
          onChangeText={t => handleChange('email', t)} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="CPF (apenas números)" 
          keyboardType="numeric"
          value={formData.cpf} 
          onChangeText={t => handleChange('cpf', t)} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Telefone" 
          keyboardType="phone-pad"
          value={formData.telefone} 
          onChangeText={t => handleChange('telefone', t)} 
        />

        <Text style={styles.label}>Endereço</Text>
        <TextInput style={styles.input} placeholder="CEP" keyboardType="numeric" value={formData.cep} onChangeText={t => handleChange('cep', t)} />
        <TextInput style={styles.input} placeholder="Logradouro" value={formData.logradouro} onChangeText={t => handleChange('logradouro', t)} />
        <TextInput style={styles.input} placeholder="Bairro" value={formData.bairro} onChangeText={t => handleChange('bairro', t)} />
        <View style={styles.row}>
          <TextInput style={[styles.input, { flex: 1, marginRight: 5 }]} placeholder="Número" value={formData.numero} onChangeText={t => handleChange('numero', t)} />
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="Comp." value={formData.complemento} onChangeText={t => handleChange('complemento', t)} />
        </View>
        <View style={styles.row}>
          <TextInput style={[styles.input, { flex: 2, marginRight: 5 }]} placeholder="Cidade" value={formData.cidade} onChangeText={t => handleChange('cidade', t)} />
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="UF" value={formData.uf} onChangeText={t => handleChange('uf', t)} maxLength={2} />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSalvar}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 15, marginBottom: 5, color: '#007AFF' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 10, fontSize: 16, backgroundColor: '#f9f9f9' },
  row: { flexDirection: 'row' },
  button: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default CadastroPacienteScreen;