import {format} from 'date-fns';
import {Platform} from 'react-native';

export const devLogger = (
  label: string,
  value: any,
  type?: 'success' | 'fail',
) => {
  if (__DEV__) {
    let logs = [
      '\n Time:',
      format(new Date(), 'PPpp'),
      '\n Label:',
      label,
      '\n Platform:',
      Platform.OS,
      '\n Value(s):',
      ...(Array.isArray(value) ? value : [value]),
    ];

    if (type) {
      logs = ['\n Type:', type, ...logs];
    }

    console.log('\n----------', ...logs, '\n----------');
  }
};
