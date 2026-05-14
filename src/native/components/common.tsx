import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/theme';
import { appStyles } from '../styles/appStyles';
import type { ScreenId } from '../types/navigation';

type ActionButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
  disabled?: boolean;
  containerStyle?: object;
  textStyle?: object;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

type TextFieldProps = {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  multiline?: boolean;
};

export function ActionButton({
  title,
  onPress,
  variant = 'primary',
  fullWidth = true,
  disabled = false,
  containerStyle,
  textStyle,
  leftIcon,
  rightIcon,
}: ActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        appStyles.actionButton,
        variant === 'primary' && appStyles.actionButtonPrimary,
        variant === 'secondary' && appStyles.actionButtonSecondary,
        variant === 'outline' && appStyles.actionButtonOutline,
        variant === 'ghost' && appStyles.actionButtonGhost,
        fullWidth && appStyles.actionButtonFullWidth,
        pressed && !disabled && appStyles.actionButtonPressed,
        disabled && appStyles.actionButtonDisabled,
        containerStyle,
      ]}
    >
      <View style={appStyles.actionButtonContent}>
        {leftIcon ? <View style={appStyles.actionButtonIconLeft}>{leftIcon}</View> : null}
        <Text
          style={[
            appStyles.actionButtonText,
            variant === 'outline' && appStyles.actionButtonTextOutline,
            variant === 'ghost' && appStyles.actionButtonTextGhost,
            textStyle,
          ]}
        >
          {title}
        </Text>
        {rightIcon ? <View style={appStyles.actionButtonIconRight}>{rightIcon}</View> : null}
      </View>
    </Pressable>
  );
}

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  multiline = false,
}: TextFieldProps) {
  return (
    <View style={appStyles.fieldWrapper}>
      {label ? <Text style={appStyles.fieldLabel}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        style={[appStyles.textField, multiline && appStyles.textFieldMultiline]}
      />
    </View>
  );
}

export function ScreenCard({ children, style }: { children: React.ReactNode; style?: object }) {
  return <View style={[appStyles.card, style]}>{children}</View>;
}

export function ScreenHeader({
  title,
  subtitle,
  onBack,
}: {
  title: string;
  subtitle?: string;
  onBack: () => void;
}) {
  return (
    <View style={appStyles.headerWrap}>
      <Pressable onPress={onBack} style={appStyles.backButton}>
        <Text style={appStyles.backButtonText}>Voltar</Text>
      </Pressable>
      <Text style={appStyles.headerTitle}>{title}</Text>
      {subtitle ? <Text style={appStyles.headerSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function BottomNavigation({
  currentScreen,
  onNavigate,
}: {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}) {
  const items: Array<{ id: ScreenId; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
    { id: 'home', label: 'Início', icon: 'home-outline' },
    { id: 'register', label: 'Registrar', icon: 'location-outline' },
    { id: 'maps', label: 'Mapas', icon: 'map-outline' },
    { id: 'history', label: 'Histórico', icon: 'list-outline' },
    { id: 'profile', label: 'Perfil', icon: 'person-outline' },
  ];

  return (
    <View style={appStyles.bottomNav}>
      {items.map((item) => {
        const active = currentScreen === item.id;
        return (
          <Pressable
            key={item.id}
            onPress={() => onNavigate(item.id)}
            style={[appStyles.bottomNavItem, active && appStyles.bottomNavItemActive]}
          >
            <Ionicons
              name={item.icon}
              size={23}
              color={active ? colors.primary : '#8A8D95'}
              style={appStyles.bottomNavIcon}
            />
            <Text style={[appStyles.bottomNavLabel, active && appStyles.bottomNavLabelActive]}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
