import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';

type ProductCardProps = {
  image: any;
  name: string;
  price: string;
  oldPrice: string;
  rating: number;
  reviews: number;
  favourite: boolean;
  onPress?: () => void;
};

const ProductCard = ({
  image,
  name,
  price,
  oldPrice,
  rating,
  reviews,
  favourite,
  onPress,
}: ProductCardProps) => {
  const [isFavourite, setIsFavourite] = useState(favourite);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.productImage} />

        <TouchableOpacity
          style={styles.heartContainer}
          onPress={() => setIsFavourite(!isFavourite)}
        >
          <Image
            source={
              isFavourite
                ? require('../assets/images/heart_active.png')
                : require('../assets/images/heart_inactive.png')
            }
            style={styles.heartIcon}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.productName}>{name}</Text>

      <View style={styles.priceRow}>
        <Text style={styles.price}>{price}</Text>

        <Text style={styles.oldPrice}>{oldPrice}</Text>
      </View>

      <View style={styles.ratingRow}>
        {[1, 2, 3, 4, 5].map(star => (
          <Image
            key={star}
            source={
              star <= rating
                ? require('../assets/images/star_filled.png')
                : require('../assets/images/star_empty.png')
            }
            style={styles.star}
          />
        ))}

        <Text style={styles.reviewText}>({reviews})</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    width: wp('42%'),
    marginBottom: hp('3%'),
  },

  imageContainer: {
    width: '100%',
    height: hp('25%'),
    backgroundColor: '#F8F8FA',
    borderRadius: wp('4%'),
    overflow: 'hidden',
  },

  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  heartContainer: {
    position: 'absolute',
    top: hp('1.2%'),
    right: wp('2.5%'),

    width: wp('7%'),
    height: wp('7%'),
    borderRadius: wp('3.5%'),
    backgroundColor: COLORS.white,

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,

    elevation: 2,
  },

  heartIcon: {
    width: wp('4.2%'),
    height: wp('4.2%'),
    resizeMode: 'contain',
  },

  productName: {
    marginTop: hp('0.7%'),
    color: COLORS.black,
    fontSize: wp('3.8%'),
    fontFamily: FONTS.regular,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.5%'),
  },

  price: {
    fontSize: wp('4.8%'),
    color: COLORS.black,
    fontFamily: FONTS.bold,
  },

  oldPrice: {
    marginLeft: wp('2%'),
    fontSize: wp('3.2%'),
    color: COLORS.gray,
    textDecorationLine: 'line-through',
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.5%'),
  },

  star: {
    width: wp('2.8%'),
    height: wp('2.8%'),
    resizeMode: 'contain',
    marginRight: wp('0.5%'),
  },

  reviewText: {
    marginLeft: wp('1%'),
    fontSize: wp('3%'),
    color: COLORS.gray,
    fontFamily: FONTS.regular,
  },
});
