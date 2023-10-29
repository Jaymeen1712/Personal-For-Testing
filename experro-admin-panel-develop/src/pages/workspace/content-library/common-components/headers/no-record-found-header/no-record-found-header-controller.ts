const useNoRecordFoundHeaderController = () => {
  const onCollapseChange = () => {
    document.dispatchEvent(new CustomEvent('collapseStatusChange', {}));
  };
  return {
    onCollapseChange,
  };
};
export default useNoRecordFoundHeaderController;
