import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Splash from './src/screens/Splash/Splash';
import MenuScreen from './src/screens/Menu/MenuScreen';
import Medico from './src/screens/Medico/Medico';
import Paciente from './src/screens/Paciente/Paciente';
import Consulta from './src/screens/Consulta/Consulta';
import CadastroEdicaoMedicoScreen from './src/screens/Medico/CadastroEdicaoMedicoScreen';

// NOVOS IMPORTS
import CadastroPacienteScreen from './src/screens/Paciente/CadastroPacienteScreen';
import AgendamentoConsultaScreen from './src/screens/Consulta/AgendamentoConsultaScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
        <Stack.Screen name="Menu" component={MenuScreen} options={{ title: 'Menu Principal' }} />
        
        <Stack.Screen name="Medicos" component={Medico} options={{ title: 'Médicos' }} />
        <Stack.Screen name="MedicoForm" component={CadastroEdicaoMedicoScreen} options={{ title: 'Gerenciar Médico' }} />

        {/* ROTAS DE PACIENTES */}
        <Stack.Screen name="Pacientes" component={Paciente} options={{ title: 'Pacientes' }} />
        <Stack.Screen name="CadastroPaciente" component={CadastroPacienteScreen} options={{ title: 'Novo Paciente' }} />

        {/* ROTAS DE CONSULTAS */}
        <Stack.Screen name="Consultas" component={Consulta} options={{ title: 'Consultas' }} />
        <Stack.Screen name="AgendamentoConsulta" component={AgendamentoConsultaScreen} options={{ title: 'Agendar Consulta' }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;