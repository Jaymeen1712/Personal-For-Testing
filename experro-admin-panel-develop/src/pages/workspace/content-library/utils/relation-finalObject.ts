// @ts-nocheck

export const RelationFinalObject = (fieldObject, formObject) => {
  const finalRequest = {};
  fieldObject.map((item) => {
    if (item.name) {
      if (item.type === 'relation') {
        finalRequest[item.name.split('/').shift()] = formObject[item.name];
      }
    } else {
      return '';
    }
    return '';
  });
  return finalRequest;
};
