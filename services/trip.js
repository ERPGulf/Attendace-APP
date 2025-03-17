import userApi from './apiClient';

export const tripTrack = async formData => {
  try {
    const { data } = await userApi.post(
      'method/employee_app.attendance_api.insert_new_trip',
      formData,
    );
    return data.message;
  } catch (error) {
    console.error('Trip tracking error:', error);
    throw new Error('Failed to start trip');
  }
};

export const userTripStatus = async employeeCode => {
  try {
    const { data } = await userApi.get(
      'method/employee_app.attendance_api.get_latest_open_trip',
      { params: { employee_id: employeeCode } },
    );
    return data.message;
  } catch (error) {
    console.error('Trip status error:', error);
    throw new Error('Failed to fetch trip status');
  }
};

export const endTripTrack = async formData => {
  try {
    const { data } = await userApi.post(
      'method/employee_app.attendance_api.close_the_trip',
      formData,
    );
    return data.message || 'Trip not ended';
  } catch (error) {
    console.error('Trip ending error:', error);
    throw new Error('Failed to end trip');
  }
};
