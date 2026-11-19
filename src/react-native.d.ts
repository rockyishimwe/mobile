import React from 'react';

declare module 'react-native' {
  export interface ViewStyle {
    [key: string]: any;
  }
  export interface TextStyle {
    [key: string]: any;
  }
  export interface ImageStyle {
    [key: string]: any;
  }

  export type StyleProp<T> = T | Array<T | undefined | null | false> | undefined | null | false;

  export interface ViewProps {
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export interface TextProps {
    style?: StyleProp<TextStyle>;
    numberOfLines?: number;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export interface TouchableOpacityProps extends ViewProps {
    onPress?: (event?: any) => void;
    activeOpacity?: number;
    disabled?: boolean;
    [key: string]: any;
  }

  export interface ScrollViewProps extends ViewProps {
    horizontal?: boolean;
    showsHorizontalScrollIndicator?: boolean;
    showsVerticalScrollIndicator?: boolean;
    contentContainerStyle?: StyleProp<ViewStyle>;
    [key: string]: any;
  }

  export interface TextInputProps extends ViewProps {
    value?: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
    placeholderTextColor?: string;
    multiline?: boolean;
    numberOfLines?: number;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    maxLength?: number;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    onSubmitEditing?: () => void;
    [key: string]: any;
  }

  export interface ImageProps {
    source: { uri: string } | number;
    style?: StyleProp<ImageStyle>;
    [key: string]: any;
  }

  export interface ModalProps {
    visible?: boolean;
    transparent?: boolean;
    animationType?: 'none' | 'slide' | 'fade';
    onRequestClose?: () => void;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export const View: React.FC<ViewProps>;
  export const Text: React.FC<TextProps>;
  export const TouchableOpacity: React.FC<TouchableOpacityProps>;
  export const ScrollView: React.FC<ScrollViewProps>;
  export const TextInput: React.FC<TextInputProps>;
  export const Image: React.FC<ImageProps>;
  export const Modal: React.FC<ModalProps>;

  export const StyleSheet: {
    create<T extends Record<string, any>>(styles: T): T;
    flatten(style: any): any;
  };

  export const Platform: {
    OS: 'ios' | 'android' | 'web' | 'windows' | 'macos';
    select<T>(specifics: { [platform: string]: T }): T;
  };
}

