import { View, Text } from "react-native";
import React from "react";
import PropTypes from "prop-types";
const LogCard = ({ type, time }) => {
  return (
    <View
      className={`w-full flex-row h-16 rounded-2xl p-2 justify-center items-center border-4 ${
        type === "IN"
          ? "bg-green-400 border-green-600"
          : "bg-red-400 border-red-600"
      }`}
    >
      <Text className="text-white font-semibold">
        CHECKED {type} AT {time}
      </Text>
    </View>
  );
};

LogCard.propTypes = {
  type: PropTypes.string,
  time: PropTypes.string,
};

LogCard.defaultProps = {
  type: "OUT",
  time: "10:00 AM",
};

export default LogCard;
