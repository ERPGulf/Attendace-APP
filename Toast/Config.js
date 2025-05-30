import {
  SuccessToast,
  ErrorToast,
  InfoToast,
} from 'react-native-toast-message';

export const toastConfig = {
  /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
  success: props => (
    <SuccessToast
      {...props}
      style={{
        backgroundColor: '#22c55e',
        borderLeftColor: '#22c55e',
        borderRadius: 15,
        width: '94%',
        height: 60,
      }}
      text1Style={{
        fontSize: 20,
        color: '#fff',
        fontWeight: 500,
        textAlign: 'center',
      }}
      text2Style={{
        fontSize: 12,
        color: '#fff',
        textAlign: 'center',
      }}
    />
  ),
  /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
  error: props => (
    <ErrorToast
      {...props}
      style={{
        backgroundColor: 'rgb(239 68 68)',
        borderLeftColor: 'rgb(239 68 68)',
        borderRadius: 15,
        width: '94%',
        height: 60,
      }}
      text1Style={{
        fontSize: 20,
        color: '#fff',
        fontWeight: 500,
        textAlign: 'center',
      }}
      text2Style={{
        fontSize: 12,
        color: '#fff',
        textAlign: 'center',
      }}
    />
  ),
  info: props => (
    <InfoToast
      {...props}
      style={{
        backgroundColor: '#0096FF',
        borderLeftColor: '#0096FF',
        borderRadius: 15,
        width: '94%',
        height: 60,
      }}
      text1Style={{
        fontSize: 20,
        color: '#fff',
        fontWeight: 500,
        textAlign: 'center',
      }}
      text2Style={{
        fontSize: 12,
        color: '#fff',
        textAlign: 'center',
      }}
    />
  ),
  /*
      Or create a completely new type - `tomatoToast`,
      building the layout from scratch.
  
      I can consume any custom `props` I want.
      They will be passed when calling the `show` method (see below)
    */
  tomatoToast: ({ text1, props }) => (
    <View style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
      <Text>{text1}</Text>
      <Text>{props.uuid}</Text>
    </View>
  ),
};
