import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator,
  Alert,
  Button // Importante para o botão de agendamento
} from 'react-native';
import api from '../../services/api';
import { useIsFocused } from '@react-navigation/native';

const Consulta = ({ navigation }) => {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      carregarConsultas();
    }
  }, [isFocused]);

  const carregarConsultas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/consultas');
      setConsultas(response.data.content || []);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as consultas.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataIso) => {
    const data = new Date(dataIso);
    return data.toLocaleString('pt-BR');
  };

  const renderItem = ({ item }) => (
    <View style={[
      styles.card, 
      item.motivoCancelamento ? styles.cancelada : null
    ]}>
      <View style={styles.header}>
        <Text style={styles.data}>{formatarData(item.data)}</Text>
        <Text style={[
          styles.status, 
          item.motivoCancelamento ? styles.textCancelado : styles.textAtivo
        ]}>
          {item.motivoCancelamento ? 'CANCELADA' : 'AGENDADA'}
        </Text>
      </View>
      
      <Text style={styles.label}>Médico: <Text style={styles.value}>{item.medico}</Text></Text>
      <Text style={styles.label}>Paciente: <Text style={styles.value}>{item.paciente}</Text></Text>
      
      {item.motivoCancelamento && (
        <Text style={styles.motivo}>Motivo: {item.motivoCancelamento}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Botão de Agendamento */}
      <View style={styles.buttonContainer}>
        <Button 
          title="Agendar Nova Consulta" 
          color="#28a745"
          onPress={() => navigation.navigate('AgendamentoConsulta')} 
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={consultas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.empty}>Nenhuma consulta agendada.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f5f5f5' },
  buttonContainer: { marginBottom: 10 },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: '#28a745' // Verde para ativo
  },
  cancelada: {
    borderLeftColor: '#dc3545', // Vermelho para cancelado
    backgroundColor: '#fff5f5'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5
  },
  data: { fontWeight: 'bold', fontSize: 16 },
  status: { fontWeight: 'bold', fontSize: 12 },
  textAtivo: { color: '#28a745' },
  textCancelado: { color: '#dc3545' },
  label: { fontSize: 14, color: '#666', marginBottom: 2 },
  value: { color: '#333', fontWeight: '500' },
  motivo: { marginTop: 5, color: '#dc3545', fontStyle: 'italic' },
  empty: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#999' }
});

export default Consulta;