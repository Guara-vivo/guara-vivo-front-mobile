export type ScreenId =
  | 'splash'
  | 'welcome'
  | 'login'
  | 'register-email'
  | 'register-password'
  | 'home'
  | 'register'
  | 'maps'
  | 'history'
  | 'record-detail'
  | 'profile'
  | 'edit-profile'
  | 'change-password'
  | 'notifications'
  | 'about';

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
