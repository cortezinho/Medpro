import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker'; // Nova importação
import api from '../../services/api';

const AgendamentoConsultaScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  
  const [selectedPaciente, setSelectedPaciente] = useState('');
  const [selectedMedico, setSelectedMedico] = useState('');
  
  // Estados para Data e Hora
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState('date'); // 'date' ou 'time'

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
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

  // Função chamada quando o usuário escolhe uma data/hora no seletor
  const onChangeData = (event, selectedDate) => {
    const currentDate = selectedDate || dataSelecionada;
    // No Android, o picker fecha após a seleção. No iOS precisa tratar diferente se quiser fechar manual.
    setShowPicker(Platform.OS === 'ios'); 
    setDataSelecionada(currentDate);
  };

  const showMode = (currentMode) => {
    setShowPicker(true);
    setMode(currentMode);
  };

  // Formata para mostrar na tela (Ex: 25/12/2025 às 14:30)
  const getDataFormatadaVisual = () => {
    return dataSelecionada.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formata para enviar ao Backend (ISO: YYYY-MM-DDTHH:mm:ss)
  const getDataFormatadaAPI = () => {
    // Ajuste simples para fuso horário local ao enviar ISO string
    // Ou usar bibliotecas como 'date-fns', mas aqui faremos manual para não instalar mais nada
    const d = new Date(dataSelecionada);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 19);
  };

  const handleAgendar = async () => {
    if (!selectedPaciente || !selectedMedico) {
      Alert.alert('Atenção', 'Selecione paciente e médico.');
      return;
    }

    // Validação básica: Não permitir datas passadas
    if (dataSelecionada < new Date()) {
      Alert.alert('Erro', 'A data da consulta não pode ser no passado.');
      return;
    }

    const payload = {
      idPaciente: selectedPaciente,
      idMedico: selectedMedico,
      data: getDataFormatadaAPI(), // Envia formato correto automaticamente
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
      
      {/* Botões para abrir o seletor */}
      <View style={styles.dateRow}>
        <TouchableOpacity style={styles.dateButton} onPress={() => showMode('date')}>
          <Text style={styles.dateButtonText}>📅 Escolher Data</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.dateButton} onPress={() => showMode('time')}>
          <Text style={styles.dateButtonText}>⏰ Escolher Hora</Text>
        </TouchableOpacity>
      </View>

      {/* Exibição visual da data escolhida */}
      <Text style={styles.dataDisplay}>
        Agendando para: {getDataFormatadaVisual()}
      </Text>

      {/* Componente do Seletor (Aparece condicionalmente) */}
      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dataSelecionada}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChangeData}
          minimumDate={new Date()} // Impede selecionar datas passadas
        />
      )}

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
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 20, backgroundColor: '#f9f9f9', overflow: 'hidden' },
  
  // Estilos novos para data
  dateRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  dateButton: { flex: 0.48, backgroundColor: '#e1f5fe', padding: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#007AFF' },
  dateButtonText: { color: '#007AFF', fontWeight: 'bold' },
  dataDisplay: { textAlign: 'center', fontSize: 16, color: '#333', marginBottom: 20, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8 },

  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default AgendamentoConsultaScreen;