import userApi from './apiClient';

export const userFileUpload = async formdata => {
  try {
    const { data } = await userApi.post('method/upload_file', formdata);
    return data.message;
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error('Failed to upload file');
  }
};

export const putUserFile = async (formData, fileId) => {
  try {
    const { data } = await userApi.put(
      `resource/Employee Checkin/${fileId}`,
      formData,
    );
    return data;
  } catch (error) {
    console.error('File update error:', error);
    throw error;
  }
};
