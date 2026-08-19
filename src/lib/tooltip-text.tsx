import {Tooltip} from 'antd';

const TooltipText = (name: any, maxLength: number) =>
  name && name?.length > maxLength ? (
    <Tooltip title={name}>
      <span>{`${name?.substring(0, maxLength)}...`}</span>
    </Tooltip>
  ) : (
    name
  );
export default TooltipText;
