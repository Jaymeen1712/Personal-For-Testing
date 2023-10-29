const CurrencyFormat = ({
  value,
  thousandSeparator,
  decimalSeparator,
  prefixSymbol,
}: {
  value: number;
  thousandSeparator: string;
  decimalSeparator: string;
  prefixSymbol: string;
}) => {
  const separator = `$1${thousandSeparator}`;
  if (!value) {
    value = 0;
  }
  const formatedValue =
    prefixSymbol +
    value
      .toFixed(2)
      .replace('.', decimalSeparator)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, separator);
  return <>{formatedValue} </>;
};

export default CurrencyFormat;
