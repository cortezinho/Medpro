// src/screens/Medico/Op1Screen.js
import React, { useState, useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  SectionList, 
  TouchableOpacity, 
  Platform,
  LayoutAnimation,
  UIManager,
  Button,
  Image
} from 'react-native';
import api from '../../services/api';
import { useIsFocused } from '@react-navigation/native';

// Ícones
const IconeLupa = require('../../../assets/lupa.png');
const IconeSeta = require('../../../assets/seta.png');

// Habilitar LayoutAnimation no Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// =====================================================================
// FUNÇÃO PARA AGRUPAR E FILTRAR
// =====================================================================
const groupAndFilterMedicos = (medicos, searchText) => {
  const filteredMedicos = medicos.filter(medico => 
    medico.nome.toLowerCase().includes(searchText.toLowerCase()) || 
    medico.especialidade.toLowerCase().includes(searchText.toLowerCase())
  );

  const grouped = filteredMedicos.reduce((acc, medico) => {
    const firstLetter = medico.nome[0].toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(medico);
    return acc;
  }, {});

  return Object.keys(grouped)
    .sort()
    .map(letter => ({
      title: letter,
      data: grouped[letter],
    }));
};

// =====================================================================
// CARD DO MÉDICO
// =====================================================================
const MedicoCard = ({ medico, navigation }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={cardStyles.card}>
      <TouchableOpacity onPress={toggleExpand} style={cardStyles.mainInfo}>
        <View>
          <Text style={cardStyles.nome}>{medico.nome}</Text>
          <Text style={cardStyles.especialidade}>
            {medico.especialidade} | CRM: {medico.crm}
          </Text>
        </View>

        <Image
          source={IconeSeta}
          style={[
            cardStyles.arrowIcon,
            { transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] },
          ]}
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={cardStyles.details}>
          <Text style={cardStyles.detailText}>Email: {medico.email}</Text>
          <Text style={cardStyles.detailText}>Telefone: {medico.telefone}</Text>
          <Text style={cardStyles.detailText}>
            Endereço: {medico.endereco.logradouro}, {medico.endereco.cidade}
          </Text>

          <View style={cardStyles.actionButtons}>
            <Button
              title="Editar"
              onPress={() =>
                navigation.navigate('MedicoForm', { medico })
              }/>
            <Button
              title="Desativar Perfil"
              color="red"
              onPress={() => navigation.navigate('EmConstrucao')}
            />
          </View>
        </View>
      )}
    </View>
  );
};

// =====================================================================
// TELA PRINCIPAL
// =====================================================================
const Op1Screen = ({ navigation }) => {
  const [medicos, setMedicos] = useState([]);
  const [searchText, setSearchText] = useState('');
  const isFocused = useIsFocused();

  // Buscar médicos ao carregar a tela
  useEffect(() => {
    if (isFocused) {
      carregarMedicos();
    }
  }, [isFocused]);

  const carregarMedicos = async () => {
    try {
      const response = await api.get("/medicos?size=100");
      const lista = response.data.content;

      // Buscar detalhes completos de cada médico
      const detalhes = await Promise.all(
        lista.map(async (m) => {
          const resp = await api.get(`/medicos/${m.id}`);
          return resp.data;
        })
      );

      setMedicos(detalhes);
    } catch (error) {
      console.log("Erro ao carregar médicos:", error);
    }
  };

  const sections = useMemo(
    () => groupAndFilterMedicos(medicos, searchText),
    [medicos, searchText]
  );

  return (
    <View style={styles.container}>
      
      {/* CAMPO DE BUSCA */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar Médico ou Especialidade"
          value={searchText}
          onChangeText={setSearchText}
        />
        <Image source={IconeLupa} style={styles.searchIcon} />
      </View>

      {/* LISTA */}
      <View style={styles.listWrapper}>
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MedicoCard medico={item} navigation={navigation} />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          contentContainerStyle={styles.sectionListContent}
          stickySectionHeadersEnabled={true}
        />
      </View>

      {/* BOTÃO FIXO */}
      <View style={styles.fixedButtonContainer}>
        <Button
          title="Cadastrar Novo Perfil"
          onPress={() => navigation.navigate('MedicoForm', { medico: null })}
        />
      </View>
    </View>
  );
};

// =====================================================================
// ESTILOS
// =====================================================================
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5', 
    padding: 10 
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
    tintColor: '#aaa',
  },
  listWrapper: {
    flex: 1,
  },
  sectionListContent: {
    paddingBottom: 10,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
    paddingVertical: 5,
    paddingHorizontal: 10,
    color: '#333',
  },
  fixedButtonContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginBottom: 25,
  },
});

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 5,
    marginHorizontal: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  mainInfo: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  especialidade: {
    fontSize: 14,
    color: '#555',
  },
  arrowIcon: {
    width: 15,
    height: 15,
    tintColor: '#007AFF',
  },
  details: {
    padding: 15,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  detailText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  }
});

export default Op1Screen;