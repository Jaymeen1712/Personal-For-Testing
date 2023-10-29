const isFieldLocalizationEnabled = (
  language?: string,
  localizationEnabled?: boolean
) => {
  if (language === 'en-us') {
    return true;
  } else if (language !== 'en-us' && localizationEnabled) {
    return true;
  } else {
    return false;
  }
};
export default isFieldLocalizationEnabled;
