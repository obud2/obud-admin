import React from 'react';
import * as AntdIcons from '@ant-design/icons';
import { SCustomIcon } from './CustomIcon.styled';

const CustomIcon = (props) => {
  const AntdIcon = AntdIcons[props.type + props.theme];

  return AntdIcon ? (
    <SCustomIcon>
      <AntdIcon {...props} />{' '}
    </SCustomIcon>
  ) : (
    ''
  );
};

export default CustomIcon;
