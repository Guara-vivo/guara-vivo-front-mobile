import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import type { CompositeNavigationProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

export type AuthStackParamList = {
  Welcome: undefined
  Login: undefined
  RegisterEmail: undefined
  RegisterPassword: undefined
}

export type MainTabParamList = {
  Home: undefined
  Register: undefined
  Maps: undefined
  History: undefined
  Profile: undefined
}

export type RootStackParamList = {
  AuthStack: undefined
  MainTabs: undefined
  RecordDetail: { recordId: number }
  EditProfile: undefined
  ChangePassword: undefined
  Notifications: undefined
  About: undefined
}

// Navegação a partir de uma aba que também abre telas da pilha raiz (detalhe, perfil...).
export type MainTabNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>
