import userApi from './apiClient';

export const getOfficeLocation = async employeeCode => {
  try {
    const params = {
      filters: JSON.stringify([['name', '=', employeeCode]]),
      fields: JSON.stringify([
        'name',
        'first_name',
        'custom_reporting_location',
      ]),
    };

    const { data } = await userApi.get(
      `resource/Employee?${new URLSearchParams(params)}`,
    );

    const location = JSON.parse(data.data[0].custom_reporting_location);
    return {
      latitude: location.features[0].geometry.coordinates[1],
      longitude: location.features[0].geometry.coordinates[0],
    };
  } catch (error) {
    console.error('Location error:', error);
    throw new Error('Failed to fetch location');
  }
};

export const userCheckIn = async fieldData => {
  try {
    const formData = new FormData();
    formData.append('employee_field_value', fieldData.employeeCode);
    formData.append('timestamp', fieldData.timestamp);
    formData.append('device_id', 'MobileAPP');
    formData.append('log_type', fieldData.type);

    const { data } = await userApi.post(
      'method/hrms.hr.doctype.employee_checkin.employee_checkin.add_log_based_on_employee_field',
      formData,
    );

    return data?.message || 'Check-in failed';
  } catch (error) {
    console.error('Check-in error:', error);
    throw new Error('Failed to check in');
  }
};
