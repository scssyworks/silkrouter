import { QRY } from './constants';
import { trim } from './utils';

export const getPath = (isHash, location) => {
  return trim(
    isHash ? location.hash.substring(1).split(QRY)[0] : location.pathname
  );
};
