import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { useNavigation } from '@react-navigation/native';

import { FONTS } from '../../../theme/fonts';
import { COLORS } from '../../../theme/colors';

import Toast from 'react-native-toast-message';
import { registerUser } from '../../../api/authApi';

const RegisterScreen = () => {
  const navigation = useNavigation<any>();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const handleRegister = async () => {
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    let isValid = true;

    if (!fullName.trim()) {
      setNameError('Full name is required');
      isValid = false;
    }

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Confirm password is required');
      isValid = false;
    }

    if (!isValid) {
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }
    try {
      const response = await registerUser(fullName, email, password);

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: response.message,
        });

        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }, 1000);
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: error?.response?.data?.message || 'Something went wrong',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.heading}>Create</Text>
        <Text style={styles.heading}>your account</Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter your name"
            placeholderTextColor={COLORS.gray}
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
          <TextInput
            placeholder="Email address"
            placeholderTextColor={COLORS.gray}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
          <TextInput
            placeholder="Password"
            placeholderTextColor={COLORS.gray}
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
          <TextInput
            placeholder="Confirm password"
            placeholderTextColor={COLORS.gray}
            secureTextEntry
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>
        {confirmPasswordError ? (
          <Text style={styles.errorText}>{confirmPasswordError}</Text>
        ) : null}

        <TouchableOpacity style={styles.signupButton} onPress={handleRegister}>
          <Text style={styles.signupText}>SIGN UP</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>or sign up with</Text>

        <View style={styles.socialContainer}>
          <TouchableOpacity>
            <Image
              source={require('../../../assets/images/apple.png')}
              style={styles.socialIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              source={require('../../../assets/images/google.png')}
              style={styles.socialIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              source={require('../../../assets/images/facebook.png')}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomContainer}>
          <Text style={styles.bottomText}>Already have account?</Text>

          <TouchableOpacity
            style={styles.loginContainer}
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              })
            }
          >
            <Text style={styles.loginLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  content: {
    flex: 1,
    paddingHorizontal: wp('9%'),
    paddingTop: hp('8%'),
  },

  heading: {
    fontSize: wp('7.2%'),
    color: COLORS.black,
    fontFamily: FONTS.regular,
    marginBottom: hp('0.8%'),
  },

  inputContainer: {
    marginTop: hp('6.5%'),
  },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    fontSize: wp('3.8%'),
    color: COLORS.black,
    paddingVertical: hp('1.5%'),
    marginBottom: hp('3%'),
    fontFamily: FONTS.regular,
  },

  signupButton: {
    width: wp('40%'),
    height: hp('6%'),
    backgroundColor: COLORS.primary,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginTop: hp('4%'),
  },

  signupText: {
    color: COLORS.white,
    fontSize: wp('4%'),
    fontFamily: FONTS.bold,
  },

  orText: {
    alignSelf: 'center',
    marginTop: hp('4%'),
    color: COLORS.gray,
    fontSize: wp('3.8%'),
    fontFamily: FONTS.regular,
  },

  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp('2.5%'),
    gap: wp('4%'),
  },

  socialIcon: {
    width: wp('12%'),
    height: wp('12%'),
    resizeMode: 'contain',
  },

  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp('8%'),
  },

  bottomText: {
    color: COLORS.black,
    fontSize: wp('3.8%'),
    fontFamily: FONTS.regular,
  },

  loginContainer: {
    marginLeft: 5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black,
  },

  loginLink: {
    color: COLORS.black,
    fontSize: wp('3.8%'),
    fontFamily: FONTS.regular,
  },
  errorText: {
    color: 'red',
    fontSize: wp('3.2%'),
    marginTop: hp('0.5%'),
  },
});
