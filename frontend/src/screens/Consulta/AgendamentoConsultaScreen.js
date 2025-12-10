import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../../services/api';

const AgendamentoConsultaScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  
  const [selectedPaciente, setSelectedPaciente] = useState('');
  const [selectedMedico, setSelectedMedico] = useState('');
  const [dataHora, setDataHora] = useState(''); // Formato: AAAA-MM-DDTHH:mm

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      // Busca médicos e pacientes para preencher os selects
      const [resPacientes, resMedicos] = await Promise.all([
        api.get('/pacientes?size=100'),
        api.get('/medicos?size=100')
      ]);
      setPacientes(resPacientes.data.content || []);
      setMedicos(resMedicos.data.content || []);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar listas de pacientes/médicos.');
    } finally {
      setLoading(false);
    }
  };

  const handleAgendar = async () => {
    if (!selectedPaciente || !selectedMedico || !dataHora) {
      Alert.alert('Atenção', 'Selecione paciente, médico e informe a data.');
      return;
    }

    // Validação básica de formato de data (YYYY-MM-DDTHH:mm)
    // Exemplo: 2025-12-25T14:30
    const regexData = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
    if (!regexData.test(dataHora)) {
      Alert.alert('Formato Inválido', 'Use o formato: AAAA-MM-DDTHH:mm\nEx: 2025-12-25T14:30');
      return;
    }

    const payload = {
      idPaciente: selectedPaciente,
      idMedico: selectedMedico,
      data: dataHora,
      // Especialidade é opcional se o médico já foi escolhido
    };

    try {
      await api.post('/consultas', payload);
      Alert.alert('Sucesso', 'Consulta agendada com sucesso!');
      navigation.goBack();
    } catch (error) {
      const msg = error.response?.data?.message || 'Erro ao agendar consulta.';
      Alert.alert('Erro', msg);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agendar Consulta</Text>

      <Text style={styles.label}>Paciente</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedPaciente}
          onValueChange={(itemValue) => setSelectedPaciente(itemValue)}
        >
          <Picker.Item label="Selecione um paciente..." value="" />
          {pacientes.map(p => (
            <Picker.Item key={p.id} label={p.nome} value={p.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Médico</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedMedico}
          onValueChange={(itemValue) => setSelectedMedico(itemValue)}
        >
          <Picker.Item label="Selecione um médico..." value="" />
          {medicos.map(m => (
            <Picker.Item key={m.id} label={`${m.nome} - ${m.especialidade}`} value={m.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Data e Hora</Text>
      <TextInput
        style={styles.input}
        placeholder="AAAA-MM-DDTHH:mm"
        value={dataHora}
        onChangeText={setDataHora}
      />
      <Text style={styles.hint}>Exemplo: 2025-10-20T14:30</Text>

      <TouchableOpacity style={styles.button} onPress={handleAgendar}>
        <Text style={styles.buttonText}>Confirmar Agendamento</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#333' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#555' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#f9f9f9' },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 20, backgroundColor: '#f9f9f9', overflow: 'hidden' },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 30 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  hint: { color: '#888', fontSize: 12, marginTop: 5, marginBottom: 20 }
});

export default AgendamentoConsultaScreen;