import { IInputComponentProps } from "@schirkan/reactron-interfaces";
import * as React from 'react';

export const StationInputControl = (props: IInputComponentProps) => {
  const stationName = props.value && props.value.name;
  return stationName ? stationName : (<span style={{ color: 'red' }}>missing</span>);
};