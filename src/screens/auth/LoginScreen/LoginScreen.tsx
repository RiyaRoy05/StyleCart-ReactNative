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
import { FONTS } from '../../../theme/fonts';
import { COLORS } from '../../../theme/colors';
import { useNavigation } from '@react-navigation/native';

import Toast from 'react-native-toast-message';
import * as Keychain from 'react-native-keychain';
import { loginUser } from '../../../api/authApi';

const LoginScreen = () => {
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Please fill all fields',
        });

        return;
      }

      const response = await loginUser(email, password);

      if (response.success) {
        await Keychain.setGenericPassword('token', response.data.token);

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: response.message,
        });

        setTimeout(() => {
          navigation.navigate('Category');
        }, 1000);
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error?.response?.data?.message || 'Invalid credentials',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.heading}>Log into</Text>
        <Text style={styles.heading}>your account</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email address"
            placeholderTextColor={COLORS.gray}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor={COLORS.gray}
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <TouchableOpacity>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>LOG IN</Text>
        </TouchableOpacity>
        <Text style={styles.orText}>or log in with</Text>
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
          <Text style={styles.bottomText}>Don't have an account?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register' as never)}
          >
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

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
    fontSize: wp('7.8%'),
    color: COLORS.black,
    fontFamily: FONTS.regular,
    marginBottom: hp('0.8%'),
  },

  inputContainer: {
    marginTop: hp('10%'),
  },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    fontSize: wp('4%'),
    color: COLORS.black,
    paddingVertical: hp('1.5%'),
    marginBottom: hp('3.8%'),
    fontFamily: FONTS.regular,
  },

  forgotText: {
    alignSelf: 'flex-end',
    color: COLORS.gray,
    fontSize: wp('3.2%'),
    marginBottom: hp('4%'),
    fontFamily: FONTS.regular,
  },

  loginButton: {
    width: wp('42%'),
    height: hp('6%'),
    backgroundColor: COLORS.primary,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },

  loginText: {
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
    marginTop: hp('3%'),
    gap: wp('3%'),
  },

  socialIcon: {
    width: wp('13%'),
    height: wp('13%'),
    resizeMode: 'contain',
  },

  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp('9%'),
  },

  bottomText: {
    color: COLORS.black,
    fontSize: wp('3.8%'),
    fontFamily: FONTS.regular,
  },

  signUpText: {
    marginLeft: 5,
    color: COLORS.black,
    fontSize: wp('3.8%'),
    fontFamily: FONTS.regular,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black,
  },
});
