import React from 'react'
import { Text } from 'native-base'
// import EStyleSheet from 'react-native-extended-stylesheet';

// const styles = EStyleSheet.create({
//   boldTextStyle: {
//     fontFamily: '$fontFamily_bold'
//   },
//   lightTextStyle: {
//     fontFamily: '$fontFamily_light'
//   },
//   textStyle: {
//     fontFamily: '$fontFamily'
//   },
// });

const MyText = props => {
  const { children, style } = props
  return (
    <Text {...props} style={[{ color: props.white ? '#fff' : '#000' }, style]}>
      {children}
    </Text>
  )
}

export { MyText }
