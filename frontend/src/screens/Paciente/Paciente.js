import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator,
  Alert,
  TouchableOpacity
} from 'react-native';
import api from '../../services/api';
import { useIsFocused } from '@react-navigation/native';

const Paciente = ({ navigation }) => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  // Carrega os pacientes sempre que a tela ganha foco
  useEffect(() => {
    if (isFocused) {
      carregarPacientes();
    }
  }, [isFocused]);

  const carregarPacientes = async () => {
    try {
      setLoading(true);
      // O backend retorna um Page, o conteúdo está em .content
      const response = await api.get('/pacientes');
      setPacientes(response.data.content || []);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os pacientes.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deletarPaciente = async (id) => {
    try {
      await api.delete(`/pacientes/${id}`);
      Alert.alert("Sucesso", "Paciente excluído.");
      carregarPacientes();
    } catch (error) {
      Alert.alert("Erro", "Falha ao excluir paciente.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.cpf}>CPF: {item.cpf}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
      <TouchableOpacity 
        onPress={() => deletarPaciente(item.id)} 
        style={styles.deleteButton}>
        <Text style={styles.deleteText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={pacientes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.empty}>Nenhum paciente encontrado.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f5f5f5' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  infoContainer: { flex: 1 },
  nome: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  cpf: { fontSize: 14, color: '#666', marginTop: 4 },
  email: { fontSize: 14, color: '#666' },
  empty: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#999' },
  deleteButton: {
    backgroundColor: '#ffcccc',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  deleteText: { color: 'red', fontWeight: 'bold' }
});

export default Paciente;