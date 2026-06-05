import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { FONTS } from '../../../theme/fonts';
import { COLORS } from '../../../theme/colors';
import React, { useState, useEffect } from 'react';
import CategoryCard from '../../../components/CategoryCard';

import { useNavigation } from '@react-navigation/native';
import Feather from '@react-native-vector-icons/feather';
import * as Keychain from 'react-native-keychain';
import { getCategories } from '../../../api/categoryApi';

const CategoryScreen = () => {
  const [activeTab, setActiveTab] = useState('search');
  const navigation = useNavigation<any>();
  const [categories, setCategories] = useState<any[]>([]);

  const [search, setSearch] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();

      if (response.success) {
        setCategories(response.data);
        setFilteredCategories(response.data);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.message,
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'Failed to load categories',
      });
    }
  };

  const handleSearch = (text: string) => {
    setSearch(text);

    const filtered = categories.filter(item =>
      item.name.toLowerCase().includes(text.toLowerCase()),
    );

    setFilteredCategories(filtered);
  };

  const handleLogout = async () => {
    await Keychain.resetGenericPassword();

    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Feather name="menu" size={wp('6%')} color={COLORS.black} />

        <Text style={styles.title}>Discover</Text>

        <Feather name="bell" size={wp('6%')} color={COLORS.black} />
      </View>

      {/* Search Section */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Feather name="search" size={wp('5.5%')} color={COLORS.textGray} />

          <TextInput
            placeholder="Search"
            placeholderTextColor={COLORS.textGray}
            value={search}
            onChangeText={handleSearch}
            style={styles.searchInput}
          />
        </View>

        <TouchableOpacity style={styles.filterContainer}>
          <Feather name="sliders" size={wp('6%')} color={COLORS.black} />
        </TouchableOpacity>
      </View>
      <View style={styles.spacer} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: hp('15%'),
        }}
      >
        {filteredCategories.map((item: any) => (
          <CategoryCard
            key={item._id}
            name={item.name}
            image={{ uri: item.image }}
            onPress={() =>
              navigation.navigate(
                'ProductListScreen' as never,
                {
                  categoryId: item._id,
                  categoryName: item.name,
                } as never,
              )
            }
          />
        ))}
      </ScrollView>
      <View style={styles.bottomTab}>
        <TouchableOpacity onPress={() => setActiveTab('home')}>
          <Feather
            name="home"
            size={wp('6%')}
            color={activeTab === 'home' ? COLORS.black : '#B5B5B5'}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab('search')}>
          <Feather
            name="search"
            size={wp('6%')}
            color={activeTab === 'search' ? COLORS.black : '#B5B5B5'}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab('bag')}>
          <Feather
            name="shopping-bag"
            size={wp('6%')}
            color={activeTab === 'bag' ? COLORS.black : '#B5B5B5'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            setActiveTab('profile');
            await handleLogout();
          }}
        >
          <Feather
            name="log-out"
            size={wp('6%')}
            color={activeTab === 'profile' ? COLORS.black : '#B5B5B5'}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('6%'),
    marginTop: hp('2.5%'),
  },

  title: {
    fontSize: wp('7%'),
    fontFamily: FONTS.bold,
    color: COLORS.black,
  },

  menuIcon: {
    width: wp('5%'),
    height: wp('5%'),
    resizeMode: 'contain',
  },

  notificationIcon: {
    width: wp('7%'),
    height: wp('7%'),
    resizeMode: 'contain',
  },

  searchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('6%'),
    marginTop: hp('3%'),
  },

  searchContainer: {
    width: wp('67%'),
    height: hp('6.8%'),
    backgroundColor: COLORS.searchBg,
    borderRadius: wp('6%'),

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: wp('5%'),

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.03,
    shadowRadius: 1,

    elevation: 2,
  },

  searchIcon: {
    width: wp('5.8%'),
    height: wp('5.8%'),
    resizeMode: 'contain',
  },

  searchText: {
    marginLeft: wp('4%'),
    color: COLORS.textGray,
    fontSize: wp('4.2%'),
    fontFamily: FONTS.regular,
  },

  filterContainer: {
    width: wp('16%'),
    height: wp('16%'),
    backgroundColor: COLORS.searchBg,
    borderRadius: wp('6%'),

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,

    elevation: 2,
  },

  filterIcon: {
    width: wp('7.5%'),
    height: wp('7.5%'),
    resizeMode: 'contain',
  },

  bottomTab: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,

    width: '100%',
    height: hp('8.5%'),

    backgroundColor: COLORS.white,

    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

    borderTopLeftRadius: wp('8%'),
    borderTopRightRadius: wp('8%'),

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,

    elevation: 10,
  },

  tabIcon: {
    width: wp('6%'),
    height: wp('6%'),
    resizeMode: 'contain',
  },

  spacer: {
    height: hp('2.5%'),
  },
  searchInput: {
    flex: 1,
    marginLeft: wp('4%'),
    color: COLORS.black,
    fontSize: wp('4.2%'),
    fontFamily: FONTS.regular,
  },
});
