import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { selectFileid } from "../../redux/Slices/UserSlice";
import { putUserFile, userFileUpload } from "../../api/userApi";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { SIZES } from "../../constants";

const FileUpload = ({ inTarget, isWFH }) => {
  const name = useSelector(selectFileid);
  const handleFileUpload = async (result) => {
    const fileType = result.type;
    const localUri = result.uri;
    const filename = localUri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `${fileType}/${match[1]}` : fileType;
    const formData = new FormData();
    formData.append(
      "fieldname",
      fileType === "image" ? "custom_photo" : "custom_video"
    );
    formData.append("file", { uri: localUri, name: filename, type });
    formData.append("is_private", "1");
    formData.append("doctype", "Employee Checkin");
    formData.append("docname", name);
    userFileUpload(formData)
      .then(({ file_url }) => {
        const formData = new FormData();
        if (fileType === "image") {
          formData.append("custom_image", file_url);
        } else {
          formData.append("custom_video", file_url);
        }
        putUserFile(formData, name)
          .then(() => {
            Toast.show({
              type: "success",
              text1:
                fileType === "image"
                  ? "✅ Photo Uploaded"
                  : "✅ Video Uploaded",
            });
          })
          .catch(() => {
            Toast.show({
              type: "error",
              text1:
                fileType === "image"
                  ? "Photo Upload Failed"
                  : "Video Upload Failed",
            });
          });
      })
      .catch(() => {
        Toast.show({
          type: "error",
          text1:
            fileType === "image"
              ? "Photo Upload Failed"
              : "Video Upload Failed",
        });
      });
  };
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (result.canceled) return;
      await handleFileUpload(result.assets[0]);
    } catch (error) {
      // Handle errors from ImagePicker
      alert("Error picking image.");
    }
  };
  return (
    <TouchableOpacity
      className={`justify-center ${
        !inTarget && !isWFH && `opacity-50`
      } items-center h-16 mt-4 flex-row justify-center space-x-2 rounded-2xl bg-blue-500`}
      disabled={!inTarget && !isWFH}
      onPress={pickImage}
    >
      <Ionicons name="image" size={SIZES.xxxLarge} color={"white"} />
      <Text className="text-xl font-bold text-white">Photo or Video</Text>
    </TouchableOpacity>
  );
};

export default FileUpload;
