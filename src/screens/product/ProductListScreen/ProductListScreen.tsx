import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getProducts } from '../../../api/productApi';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Feather from '@react-native-vector-icons/feather';

import ProductCard from '../../../components/ProductCard';

import { COLORS } from '../../../theme/colors';
import { FONTS } from '../../../theme/fonts';

const ProductListScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [products, setProducts] = useState<any[]>([]);

  const { categoryId, categoryName } = route.params ?? {};

  useEffect(() => {
    if (!categoryId) return;

    const loadProducts = async () => {
      try {
        const response = await getProducts(categoryId);

        console.log(response);

        if (response.success) {
          setProducts(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadProducts();
  }, [categoryId]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="chevron-left" size={22} color={COLORS.black} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{categoryName}</Text>
      </View>

      <View style={styles.topSection}>
        <Text style={styles.resultText}>
          Found{'\n'}
          {products.length} Results
        </Text>

        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Filter</Text>

          <Feather name="chevron-down" size={16} color={COLORS.black} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <ProductCard
            image={{ uri: item.image }}
            name={item.name}
            price={`$${item.price}`}
            oldPrice={
              item.discount > 0
                ? `$${Math.round(item.price / (1 - item.discount / 100))}`
                : ''
            }
            rating={item.rating}
            reviews={item.reviewCount}
            favourite={false}
            onPress={() =>
              navigation.navigate('ProductDetailsScreen', {
                productId: item._id,
              })
            }
          />
        )}
      />
    </SafeAreaView>
  );
};

export default ProductListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('6%'),
    marginTop: hp('1%'),
  },

  backButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: '#F8F8FA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    marginLeft: wp('4%'),
    fontSize: wp('5.5%'),
    color: COLORS.black,
    fontFamily: FONTS.bold,
  },

  topSection: {
    marginTop: hp('3%'),
    marginHorizontal: wp('6%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  resultText: {
    fontSize: wp('4.5%'),
    color: COLORS.black,
    fontFamily: FONTS.bold,
    lineHeight: hp('4%'),
  },

  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1.2%'),
    borderWidth: 1,
    borderColor: '#E6E8EC',
    borderRadius: wp('6%'),
  },

  filterText: {
    marginRight: wp('2%'),
    fontSize: wp('3.8%'),
    color: COLORS.black,
    fontFamily: FONTS.regular,
  },

  listContainer: {
    paddingHorizontal: wp('6%'),
    paddingTop: hp('3%'),
    paddingBottom: hp('3%'),
  },

  row: {
    justifyContent: 'space-between',
  },
});
