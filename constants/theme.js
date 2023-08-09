import { Dimensions, StatusBar } from 'react-native'
const { height, width } = Dimensions.get('window');

const COLORS = {
    primary: "#F85A27",
    secondary: "#DDF0FF",
    tertiary: "#E9BD21",

    gray: "#83829A",
    gray2: "#C1C0C8",

    offwhite: "#F3F4F8",
    white: "#FFFFFF",
    black: "#000000",
    red: "#D21212",
    green: " #00C135",
    lightWhite: "#FAFAFC",
};


const SIZES = {
    xSmall: 10,
    small: 12,
    medium: 16,
    large: 20,
    xLarge: 24,
    xxLarge: 26,
    xxxLarge: 44,
    height: height - StatusBar.currentHeight,
    width
};


const SHADOWS = {
    small: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 2,
    },
    medium: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5.84,
        elevation: 5,
    },
};


export { COLORS, SIZES, SHADOWS };