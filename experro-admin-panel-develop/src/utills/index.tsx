import moment from 'moment-timezone';
import Cookies from 'js-cookie';
import { notification } from 'antd';

// @ts-ignore
import DOMPurify from 'dompurify';
import { ISortDataObject } from '../types';
import SortAscIcon from '../images/icons/sort-asc-icon';
import SortDescIcon from '../images/icons/sort-desc-icon';
import { camelToSnackCase } from './convert-request-response';
import TableSortIcon from '../images/icons/table-sort-icon';

export * from './convert-request-response';
export * from './enums';

export const getPasswordStrength = (
  password: string,
  t: (name: string) => string
) => {
  const measureStrength = (values: string) => {
    if (password) {
      password = password.trim();
    } else {
      return 0;
    }

    let score = 0;

    // award every unique letter until 5 repetitions

    const letters: Record<string, number> = {};

    for (let i = 0; i < password.length; i++) {
      letters[values[i]] = (letters[values[i]] || 0) + 1;
      score += 5.0 / letters[values[i]];
    }

    // bonus points for mixing it up
    const variations = {
      digits: /\d/.test(values),
      lower: /[a-z]/.test(values),
      upper: /[A-Z]/.test(values),
      nonWords: /\W/.test(values),
      password: values.match(
        /^(?!.* )(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[$#^@\\&%_.~!*]).{10,20}$/
      ),
    };

    let variationCount = 0;

    for (const check in variations) {
      // @ts-ignore
      variationCount += variations[check] ? 1 : 0;
    }

    score += variationCount * 10;

    return Math.trunc(score);
  };

  const result = measureStrength(password);

  if (result >= 120) {
    return t('common.labels.strong');
  } else if (result >= 110) {
    return t('common.labels.good');
  } else if (result >= 97) {
    return t('common.labels.fair');
  } else {
    return t('common.labels.weak');
  }
};

export const isGuid = (groupId: string) => {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return regexExp.test(groupId);
};

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1000,
    dm = 2,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export function generateInternalFieldName(val: string) {
  return val
    .replace(/[^a-zA-Z0-9-_ ]/g, '')
    .replaceAll(' ', '_')
    .replaceAll('-', '_')
    .toLowerCase();
}

export function internalNameGenerator(val: string) {
  return val
    .replace(/[^a-zA-Z0-9-_ ]/g, '')
    .replaceAll(' ', '_')
    .toLowerCase();
}

export const snakeToCamel = (str?: string) =>
  str
    ?.toLowerCase()
    .replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace('-', '').replace('_', '')
    );

export const convertAndFormatDate = (
  date?: string,
  timezone = 'UTC',
  format = 'DD/MM/YYYY hh:mm a'
) => {
  return moment.tz(date, timezone).format(format);
};

export const convertUtcToCurrentTimeZone = (UTCDateString?: string) => {
  const utcTime = moment.utc(UTCDateString).local().format();
  return utcTime;
};

export const convertCurrentTimeZoneToUtc = (
  localDateString?: string,
  timeZone = 'UTC'
) => {
  const localTime = moment.tz(localDateString, timeZone).format();
  return localTime;
};

export const convertDateTimeToUserTimezone = (
  dateString: string,
  timeZone?: string
) => {
  const date = new Date(dateString);
  if (!timeZone) {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  //date format change by locale
  const locale = window.navigator.language;
  const options: object = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    //time format change by timezone
    timeZone: timeZone,
  };

  return new Intl.DateTimeFormat(locale, options).format(date);
};

export const removeCookies = () => {
  Cookies.remove('exp-ecomm-provider-chid');
  Cookies.remove('exp-eid');
  Cookies.remove('exp-tid');
  Cookies.remove('exp-wid');
  Cookies.remove('exp-etype');
  Cookies.remove('exp-whash');
  Cookies.remove('wd');
  Cookies.remove('exp-ecomm-provider');
  Cookies.remove('exp-rid');
  Cookies.remove('exp-ses-id');
  Cookies.remove('pageEditorPopUp');
  Cookies.remove('exp-ses-id');
};

export const avatarColorCode = (initials?: string) => {
  if (initials) {
    let code = 0;
    for (let i = 0; i < initials.length; i++) {
      code += initials.charCodeAt(i);
    }
    return code % 10;
  }
};

export const generateBackgroundColor = () =>
  'rgb(' +
  Math.floor(Math.random() * 256) +
  ',' +
  Math.floor(Math.random() * 256) +
  ',' +
  Math.floor(Math.random() * 256) +
  ')';

export const pieChartColors = (
  color: string,
  intensity: number,
  numShades: number
) => {
  const r = parseInt(color.substring(1, 3), 16);
  const g = parseInt(color.substring(3, 5), 16);
  const b = parseInt(color.substring(5, 7), 16);

  // Calculate the step size for each channel (r, g, b)
  const rStep = ((255 - r) * intensity) / (numShades + 1);
  const gStep = ((255 - g) * intensity) / (numShades + 1);
  const bStep = ((255 - b) * intensity) / (numShades + 1);

  // Create an array to hold the color shades
  const shades = [];

  // Generate the color shades
  for (let i = 1; i <= numShades; i++) {
    shades.push(
      '#' +
        Math.round(r + rStep * i)
          .toString(16)
          .padStart(2, '0') +
        Math.round(g + gStep * i)
          .toString(16)
          .padStart(2, '0') +
        Math.round(b + bStep * i)
          .toString(16)
          .padStart(2, '0')
    );
  }

  return shades;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getDateArray = function (start: any, end: any) {
  const arr = [];
  const dt = new Date(start);
  while (dt <= end) {
    arr.push(moment(new Date(dt)).format('DD MMM'));
    dt.setDate(dt.getDate() + 1);
  }
  return arr;
};

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export const openNotificationWithIcon = (
  type: NotificationType,
  message: string
) => {
  notification[type]({
    message: message,
    duration: 3,
    placement: 'top',
  });
};

export const divideTheArrayIntoChunks = (
  array: string[] | number[],
  chunkSize: number
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const responseArray: any = [];
  array.map((element) => responseArray.push(array.splice(0, chunkSize)));
  return responseArray;
};

export const selectedAudienceType = (selectedType: string) => {
  switch (selectedType) {
    case '[CLY]_view':
      return 'Page View';
    case 'product_viewed':
      return 'Product Viewed';
    case 'product_searched_zero_result':
      return 'Product Search With Zero Result';
    case 'linkClick':
      return 'Link Click';
    case 'product_searched':
      return 'Product Searched';
    case 'category_viewed':
      return 'Category Viewed';
    case 'add_to_ring':
      return 'Add To Ring';
    case 'sign_up':
      return 'Sign Up';
    case 'product_added_to_cart':
      return 'Product Added To Cart';
    case 'cart_viewed':
      return 'Cart Viewed';
    case 'checkout_initiated':
      return 'Checkout Initiated';
    case 'product_removed_from_cart':
      return 'Product Removed From Cart';
    case 'checkout_completed':
      return 'Checkout Completed';
    case 'product_purchased':
      return 'Product Purchased';
    case 'widget_loaded':
      return 'Widget Loaded';
  }
};

export const onSidebarToggle = () => {
  document.dispatchEvent(new CustomEvent('toggleSidebar'));
};

export const onMainSidebarCollapsed = (val: boolean) => {
  document.dispatchEvent(new CustomEvent('toggleMainSidebar', { detail: val }));
};

export const onSubSidebarCollapse = (val: boolean) => {
  document.dispatchEvent(
    new CustomEvent('onSubSideBarCollapse', { detail: val })
  );
};

export const currencyFormatter = (currency: string, price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
};

export const numberFormatter = (number: number) => {
  return Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(
    number
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const kFormatter = (num: any) => {
  return num > 999
    ? // @ts-ignore
      Math.sign(num) * (Math.abs(num) / 1000).toFixed(1)
    : // @ts-ignore
      Math.sign(num) * (Math.abs(num) / 1000).toFixed(3);
};

export const validateEmail = (email: string) => {
  return /\S+@\S+\.\S+/.test(email);
};

export const domPurify = (html: string) => {
  return DOMPurify.sanitize(html);
};

export const sortableHeader = (
  title: string,
  key: string,
  sortData: ISortDataObject
) => {
  return (
    <div className="ant-row ant-space-align-center ant-row-no-wrap">
      <span className="m-r-4">{title}</span>

      {sortData.sortBy === camelToSnackCase(key) ? (
        sortData.orderBy === 'asc' ? (
          <SortAscIcon />
        ) : (
          <SortDescIcon />
        )
      ) : (
        <div className="table-sort-icon">
          <TableSortIcon />
        </div>
      )}
    </div>
  );
};

export const percentage = (newValue: number, oldValue: number) => {
  return (oldValue === 0 && newValue === 0) ||
    (isNaN(oldValue) && isNaN(newValue)) ||
    isNaN(newValue)
    ? 0
    : oldValue > 0
    ? ((newValue - oldValue) / oldValue) * 100
    : 100;
};

export const allowSpecificDomain = (email?: string) => {
  return ['rapidops.com', 'experro.com', '1center.co'].includes(
    //@ts-ignore
    email?.toLowerCase().substring(email?.toLowerCase().lastIndexOf('@') + 1)
  );
};
