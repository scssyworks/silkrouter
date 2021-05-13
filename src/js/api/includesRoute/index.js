import { INVALID_LIST } from '../../utils/constants';
import { extractParams } from '../../utils/params';
import { isArr, trim } from '../../utils/utils';

export default function includesRoute(list, route) {
  route = trim(route);
  if (!isArr(list)) {
    throw new TypeError(INVALID_LIST);
  }
  let result = false;
  for (let index = 0; index < list.length; index++) {
    const listItem = trim(list[index]);
    if (
      ['*', route].indexOf(listItem) > -1 ||
      !!Object.keys(extractParams(listItem, route)).length
    ) {
      result = true;
      break;
    }
  }
  return result;
}
