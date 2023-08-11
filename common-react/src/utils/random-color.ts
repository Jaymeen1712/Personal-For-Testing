import React from "react";

const randomColor = (n: number) =>
  "#" + ((n * 1234567) % Math.pow(2, 24)).toString(16).padStart(6, "0");

export default randomColor;
