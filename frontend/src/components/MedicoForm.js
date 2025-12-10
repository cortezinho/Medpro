import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Platform,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';

// Lista de Especialidades
const especialidades = [
  'CARDIOLOGIA', 'PEDIATRIA', 'DERMATOLOGIA', 'GINECOLOGIA', 
  'NEUROLOGIA', 'OFTALMOLOGIA', 'CLINICA_GERAL', 'ORTOPEDIA'
];

const initialMedicoState = {
  nome: '',
  especialidade: especialidades[0],
  crm: '',
  email: '',
  telefone: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: '',
  cep: '',
};

// Componente de Input extraído para fora para evitar perda de foco
const ValidatedInput = ({ label, value, onChangeText, error, style, ...props }) => (
  <View style={formStyles.inputGroup}>
    <Text style={formStyles.label}>{label}</Text>
    <TextInput
      style={[
        formStyles.input,
        style,
        error && formStyles.inputError
      ]}
      value={value}
      onChangeText={onChangeText}
      {...props}
    />
    {error && <Text style={formStyles.errorText}>{error}</Text>}
  </View>
);

const MedicoForm = ({ medico, onSave, onCancel, navigation }) => {
  const [formData, setFormData] = useState(initialMedicoState);
  const [errors, setErrors] = useState({});

  const isEditing = !!medico;
  const buttonTitle = isEditing ? 'Concluir Edição' : 'Concluir Cadastro';

  // Popula o formulário se estiver editando
  useEffect(() => {
    if (medico) {
      setFormData({
        nome: medico.nome || '',
        especialidade: medico.especialidade || especialidades[0],
        crm: medico.crm || '',
        email: medico.email || '',
        telefone: medico.telefone || '',
        // Flattening address for the form state
        logradouro: medico.endereco?.logradouro || '',
        numero: medico.endereco?.numero || '',
        complemento: medico.endereco?.complemento || '',
        bairro: medico.endereco?.bairro || '',
        cidade: medico.endereco?.cidade || '',
        uf: medico.endereco?.uf || '',
        cep: medico.endereco?.cep || '',
      });
    }
  }, [medico]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const validate = () => {
    let valid = true;
    const newErrors = {};
    const requiredFields = ['nome', 'especialidade', 'crm', 'email', 'telefone', 'logradouro', 'bairro', 'cidade', 'uf', 'cep'];

    requiredFields.forEach(field => {
      if (!formData[field] || String(formData[field]).trim() === '') {
        newErrors[field] = 'Campo Obrigatório';
        valid = false;
      }
    });

    if (formData.cep && !/^\d{8}$/.test(formData.cep)) {
      newErrors.cep = 'CEP deve conter 8 dígitos';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (!validate()) {
      Alert.alert('Erro', 'Por favor, corrija os campos destacados.');
      return;
    }
    // Passa os dados para a tela pai tratar o envio
    onSave(formData);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>
          {isEditing ? 'Editar Perfil' : 'Novo Cadastro'}
        </Text>

        {/* 1. PROFISSIONAL */}
        <Text style={styles.sectionHeader}>1. Profissional</Text>

        <ValidatedInput 
          label="Nome Completo"
          value={formData.nome}
          onChangeText={(t) => handleChange('nome', t)}
          error={errors.nome}
          placeholder="Ex: Ana Maria da Silva"
        />

        <View style={formStyles.inputGroup}>
          <Text style={formStyles.label}>Especialidade</Text>
          <View style={[formStyles.pickerWrapper, errors.especialidade && formStyles.inputError]}>
            <Picker
              selectedValue={formData.especialidade}
              onValueChange={(val) => handleChange('especialidade', val)}
              style={formStyles.picker}
            >
              {especialidades.map(esp => (
                <Picker.Item key={esp} label={esp} value={esp} />
              ))}
            </Picker>
          </View>
        </View>

        <ValidatedInput 
          label="CRM"
          value={formData.crm}
          onChangeText={(t) => handleChange('crm', t)}
          error={errors.crm}
          placeholder="Ex: 123456"
          keyboardType="numeric"
        />

        {/* 2. CONTATOS */}
        <Text style={styles.sectionHeader}>2. Contatos</Text>

        <ValidatedInput 
          label="Email"
          value={formData.email}
          onChangeText={(t) => handleChange('email', t)}
          error={errors.email}
          placeholder="email@exemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <ValidatedInput 
          label="Telefone"
          value={formData.telefone}
          onChangeText={(t) => handleChange('telefone', t)}
          error={errors.telefone}
          placeholder="(XX) XXXXX-XXXX"
          keyboardType="phone-pad"
        />

        {/* 3. ENDEREÇO */}
        <Text style={styles.sectionHeader}>3. Endereço Profissional</Text>

        <ValidatedInput 
          label="Logradouro"
          value={formData.logradouro}
          onChangeText={(t) => handleChange('logradouro', t)}
          error={errors.logradouro}
          placeholder="Ex: Rua das Flores"
        />

        <ValidatedInput 
          label="Bairro"
          value={formData.bairro}
          onChangeText={(t) => handleChange('bairro', t)}
          error={errors.bairro}
          placeholder="Ex: Centro"
        />

        <View style={formStyles.row}>
          <ValidatedInput 
            label="Número"
            value={formData.numero}
            onChangeText={(t) => handleChange('numero', t)}
            error={errors.numero}
            placeholder="Nº"
            style={formStyles.inputHalf}
          />
          <ValidatedInput 
            label="Complemento"
            value={formData.complemento}
            onChangeText={(t) => handleChange('complemento', t)}
            placeholder="Apto 101"
            style={formStyles.inputHalf}
          />
        </View>

        <ValidatedInput 
          label="Cidade"
          value={formData.cidade}
          onChangeText={(t) => handleChange('cidade', t)}
          error={errors.cidade}
          placeholder="Ex: São Paulo"
        />

        <View style={formStyles.row}>
          <ValidatedInput 
            label="UF"
            value={formData.uf}
            onChangeText={(t) => handleChange('uf', t)}
            error={errors.uf}
            placeholder="SP"
            maxLength={2}
            autoCapitalize="characters"
            style={formStyles.inputQuarter}
          />
          <ValidatedInput 
            label="CEP"
            value={formData.cep}
            onChangeText={(t) => handleChange('cep', t)}
            error={errors.cep}
            placeholder="12345678"
            maxLength={8}
            keyboardType="numeric"
            style={formStyles.inputThreeQuarter}
          />
        </View>

      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[formStyles.button, formStyles.saveButton]} onPress={handleSubmit}>
          <Text style={formStyles.buttonText}>{buttonTitle}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[formStyles.button, formStyles.cancelButton]} onPress={onCancel}>
          <Text style={formStyles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10, color: '#007AFF', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5 },
  buttonContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 10, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#ddd', flexDirection: 'row', justifyContent: 'space-between' },
});

const formStyles = StyleSheet.create({
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, marginBottom: 5, fontWeight: '500', color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 16, backgroundColor: '#f9f9f9', height: 45 },
  inputError: { borderColor: 'red', borderWidth: 2, backgroundColor: '#ffe8e8' },
  errorText: { fontSize: 12, color: 'red', marginTop: 4 },
  row: { flexDirection: 'row', gap: 10 },
  inputHalf: { flex: 1 },
  inputQuarter: { flex: 0.3 },
  inputThreeQuarter: { flex: 0.7 },
  pickerWrapper: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, backgroundColor: '#f9f9f9', justifyContent: 'center', height: 45, overflow: 'hidden' },
  picker: { height: Platform.OS === 'ios' ? undefined : 45, width: '100%' },
  button: { flex: 1, padding: 15, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  saveButton: { backgroundColor: '#007AFF' },
  cancelButton: { backgroundColor: '#6c757d' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default MedicoForm;