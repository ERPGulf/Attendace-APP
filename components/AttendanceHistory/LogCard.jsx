import { View, Text } from "react-native";
import React from "react";
import PropTypes from "prop-types";
import { COLORS } from "../../constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { format } from "date-fns";
const LogCard = ({ type, time }) => {
  const formattedDate = (inputDate) => {
    const date = new Date(inputDate);
    return format(date, "HH:mm a, dd/MM/yy");
  };
  const times = formattedDate(time);
  return (
    <View
      style={{ backgroundColor: COLORS.primary }}
      className={`w-full flex-row h-16 rounded-xl py-2 px-4 justify-between items-center my-1`}
    >
      <Text className="text-white font-semibold text-xs">
        CHECKED {type} AT {times}
      </Text>
      <View
        className={`justify-between items-center rounded-full p-1 ${
          type === "IN" ? "bg-green-500" : "bg-red-500 "
        }`}
      >
        <MaterialCommunityIcons name="clock-check" color={"white"} size={30} />
      </View>
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
