import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Feather from '@react-native-vector-icons/feather';
import { useNavigation } from '@react-navigation/native';

import { COLORS } from '../../../theme/colors';

import { useRoute } from '@react-navigation/native';
import { getSingleProduct, getRelatedProducts } from '../../../api/productApi';

const ProductDetailsScreen = () => {
  const navigation = useNavigation<any>();
  const [isFavourite, setIsFavourite] = useState(true);
  const route = useRoute<any>();

  const { productId } = route.params ?? {};

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!productId) {
      return;
    }

    const loadProduct = async () => {
      try {
        const response = await getSingleProduct(productId);

        if (response.success) {
          setProduct(response.data);

          const relatedResponse = await getRelatedProducts(
            response.data.category._id,
            response.data._id,
          );

          if (relatedResponse.success) {
            setRelatedProducts(relatedResponse.data);
          } else {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2:
                relatedResponse.message || 'Failed to load related products',
            });
          }
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: response.message || 'Failed to load product details',
          });
        }
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2:
            error?.response?.data?.message || 'Failed to load product details',
        });
      }
    };

    loadProduct();
  }, [productId]);

  if (!productId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>No product selected.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const stockTextColor = product.stock > 0 ? '#34C759' : '#FF3B30';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="chevron-left" size={24} color={COLORS.black} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setIsFavourite(!isFavourite)}
          >
            <Image
              source={
                isFavourite
                  ? require('../../../assets/images/heart_active.png')
                  : require('../../../assets/images/heart_inactive.png')
              }
              style={styles.heartIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.imageSection}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={event => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x /
                  event.nativeEvent.layoutMeasurement.width,
              );

              setActiveImage(index);
            }}
          >
            {product.images?.map((img: string, index: number) => (
              <Image
                key={index}
                source={{ uri: img }}
                style={styles.productImage}
              />
            ))}
          </ScrollView>
        </View>
        <View style={styles.indicatorRow}>
          {product.images?.map((_: string, index: number) => (
            <View
              key={index}
              style={[
                styles.indicator,
                activeImage === index && styles.activeIndicator,
              ]}
            />
          ))}
        </View>

        <View style={styles.titleRow}>
          <View style={{ flex: 1, marginRight: wp('3%') }}>
            <Text style={styles.productTitle}>{product.name}</Text>

            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map(star => (
                <Image
                  key={star}
                  source={require('../../../assets/images/star_filled.png')}
                  style={styles.star}
                />
              ))}

              <Text style={styles.reviewText}>({product.reviewCount})</Text>
            </View>
          </View>

          <Text style={styles.productPrice}>${product.price}</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.optionRow}>
          <View>
            <View>
              <Text style={styles.optionTitle}>Brand</Text>
              <Text style={styles.brandText}>{product.brand}</Text>
            </View>
          </View>

          <View>
            <Text style={styles.optionTitle}>Stock</Text>
            <Text
              style={[
                styles.stockText,
                {
                  color: stockTextColor,
                },
              ]}
            >
              {product.stock} Available
            </Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.infoRow}>
            <Text style={styles.infoTitle}>Description</Text>

            <Feather name="chevron-down" size={20} color={COLORS.black} />
          </TouchableOpacity>
          <View style={styles.divider} />

          <Text style={styles.descriptionText}>{product.description}</Text>

          <TouchableOpacity style={styles.infoRow}>
            <Text style={styles.infoTitle}>Reviews</Text>

            <Feather name="chevron-down" size={20} color={COLORS.black} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <View style={styles.reviewSummary}>
            <View style={styles.reviewLeft}>
              <Text style={styles.reviewScore}>{product.rating}</Text>

              <Text style={styles.outOfText}>OUT OF 5</Text>
            </View>

            <View style={styles.reviewRight}>
              <View style={styles.ratingRow}>
                {Array.from({
                  length: Math.round(product.rating),
                }).map((_, index) => (
                  <Image
                    key={index}
                    source={require('../../../assets/images/star_filled.png')}
                    style={styles.star}
                  />
                ))}
              </View>

              <Text style={styles.ratingCount}>
                {product.reviewCount} ratings
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.infoRow}>
          <Text style={styles.infoTitle}>Similar Product</Text>

          <Feather name="chevron-down" size={20} color={COLORS.black} />
        </TouchableOpacity>
        <View style={styles.divider} />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.similarContainer}
        >
          {relatedProducts.map(item => (
            <TouchableOpacity
              key={item._id}
              style={styles.similarCard}
              onPress={() =>
                navigation.navigate(
                  'ProductDetailsScreen' as never,
                  {
                    productId: item._id,
                  } as never,
                )
              }
            >
              <Image
                source={{
                  uri: item.image,
                }}
                style={styles.similarImage}
              />

              <Text style={styles.similarName}>{item.name}</Text>

              <Text style={styles.similarPrice}>${item.price}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  header: {
    position: 'absolute',
    top: hp('1%'),
    left: 0,
    right: 0,

    flexDirection: 'row',
    justifyContent: 'space-between',

    paddingHorizontal: wp('6%'),

    zIndex: 100,
  },

  iconButton: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    backgroundColor: '#F8F8FA',

    justifyContent: 'center',
    alignItems: 'center',
  },

  heartIcon: {
    width: wp('5%'),
    height: wp('5%'),
    resizeMode: 'contain',
  },

  imageSection: {
    width: '100%',
    height: hp('45%'),
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: -hp('2%'),
  },

  productImage: {
    width: wp('100%'),
    height: hp('58%'),
    resizeMode: 'cover',
  },

  detailsContainer: {
    backgroundColor: COLORS.white,
    marginTop: -hp('3%'),

    borderTopLeftRadius: wp('8%'),
    borderTopRightRadius: wp('8%'),

    paddingTop: hp('3%'),
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('8%'),
    marginTop: hp('3%'),
  },

  infoTitle: {
    fontSize: wp('4.8%'),
    color: COLORS.black,
    fontWeight: '600',
  },
  descriptionText: {
    marginTop: hp('1.5%'),

    color: '#7A7A7A',

    fontSize: wp('3.8%'),
    paddingHorizontal: wp('8%'),

    lineHeight: hp('3.2%'),
  },

  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'center',

    marginTop: hp('1.5%'),
    marginBottom: hp('3%'),
  },

  indicator: {
    width: wp('2.5%'),
    height: wp('2.5%'),
    borderRadius: wp('1.25%'),
    backgroundColor: '#D9D9D9',
    marginHorizontal: wp('1%'),
  },

  activeIndicator: {
    backgroundColor: COLORS.black,
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',

    marginTop: hp('2%'),

    paddingHorizontal: wp('8%'),
  },

  productTitle: {
    fontSize: wp('4%'),
    fontWeight: '700',
    color: COLORS.black,
  },

  productPrice: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
    color: COLORS.black,
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('1%'),
  },

  star: {
    width: wp('4%'),
    height: wp('4%'),
    resizeMode: 'contain',
    marginRight: wp('0.8%'),
  },

  reviewText: {
    marginLeft: wp('1%'),
    color: COLORS.gray,
    fontSize: wp('3.5%'),
  },

  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginTop: hp('3%'),

    paddingHorizontal: wp('8%'),

    paddingBottom: hp('3%'),
  },

  optionTitle: {
    color: COLORS.gray,
    fontSize: wp('4%'),
    marginBottom: hp('1.5%'),
  },

  colorRow: {
    flexDirection: 'row',
  },

  colorCircle: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('4%'),
    marginRight: wp('3%'),
  },

  sizeRow: {
    flexDirection: 'row',
  },

  sizeCircle: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('4%'),

    backgroundColor: '#F7F7F7',

    justifyContent: 'center',
    alignItems: 'center',

    marginLeft: wp('2%'),
  },

  activeSizeCircle: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('4%'),

    backgroundColor: '#5D5D5D',

    justifyContent: 'center',
    alignItems: 'center',

    marginLeft: wp('2%'),
  },

  divider: {
    height: 1,
    backgroundColor: '#EAEAEA',

    marginVertical: hp('2%'),

    marginHorizontal: wp('8%'),
  },
  reviewSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingHorizontal: wp('8%'),

    marginTop: hp('0%'),
    marginBottom: hp('4%'),
  },

  reviewLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  reviewScore: {
    fontSize: wp('10%'),
    fontWeight: '700',
    color: COLORS.black,
  },

  outOfText: {
    marginLeft: wp('2%'),

    color: COLORS.gray,
    fontSize: wp('3%'),
  },

  reviewRight: {
    alignItems: 'flex-end',
  },

  ratingCount: {
    marginTop: hp('0.5%'),

    color: COLORS.gray,
    fontSize: wp('3%'),
  },
  similarContainer: {
    paddingLeft: wp('8%'),
    paddingBottom: hp('4%'),
  },

  similarCard: {
    width: wp('32%'),
    marginRight: wp('4%'),
    marginTop: hp('2%'),
  },

  similarImage: {
    width: wp('32%'),
    height: hp('16%'),
    borderRadius: wp('3%'),
    resizeMode: 'cover',
  },

  similarName: {
    marginTop: hp('1%'),
    color: COLORS.black,
    fontSize: wp('3.4%'),
  },

  similarPrice: {
    marginTop: hp('0.5%'),
    color: COLORS.black,
    fontSize: wp('4.2%'),
    fontWeight: '600',
  },
  brandText: {
    color: COLORS.black,
    fontSize: wp('4.2%'),
    fontWeight: '600',
  },

  stockText: {
    fontSize: wp('4.2%'),
    fontWeight: '600',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    color: COLORS.black,
    fontSize: wp('4.5%'),
    fontWeight: '600',
  },
});
