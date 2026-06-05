import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { FONTS } from '../theme/fonts';

type CategoryCardProps = {
  name: string;
  image: any;
  onPress?: () => void;
};

const CategoryCard = ({ name, image, onPress }: CategoryCardProps) => {
  return (
    <TouchableOpacity style={styles.categoryCard} onPress={onPress}>
      <Text style={styles.categoryText}>{name}</Text>

      <Image
        source={typeof image === 'string' ? { uri: image } : image}
        style={styles.categoryImage}
      />
    </TouchableOpacity>
  );
};

export default CategoryCard;

const styles = StyleSheet.create({
  categoryCard: {
    marginHorizontal: wp('6%'),
    marginBottom: hp('2.5%'),
    height: hp('16%'),
    borderRadius: wp('6%'),
    overflow: 'hidden',
    justifyContent: 'center',
    backgroundColor: '#F4F4F4',
    paddingLeft: wp('4%'),
  },

  categoryText: {
    color: '#222222',
    fontSize: wp('5.3%'),
    fontFamily: FONTS.bold,
    marginLeft: wp('4.5%'),
    width: wp('40%'),
    zIndex: 999,
  },

  categoryImage: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: wp('38%'),
    height: hp('16%'),
    resizeMode: 'cover',
  },

  largeCircle: {
    position: 'absolute',
    right: wp('1%'),
    width: wp('33%'),
    height: wp('33%'),
    resizeMode: 'contain',
    top: hp('1%'),
  },

  smallCircle: {
    position: 'absolute',
    right: wp('5.5%'),
    width: wp('23%'),
    height: wp('23%'),
    resizeMode: 'contain',
    top: hp('3%'),
  },
});
