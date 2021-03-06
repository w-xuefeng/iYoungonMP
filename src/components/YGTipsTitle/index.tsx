import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import "./index.scss";

interface YGTipsTitlePropsType {
  icon: string;
  title: string | JSX.Element;
  width?: string;
  color?: string;
  fontSize?: number;
  backgroundColor?: string;
  tipsInnerStyle?: Record<string, string | number>;
  iconStyle?: Record<string, string | number>;
  onClick?: () => void;
}
export default function YGTipsTitle(props: YGTipsTitlePropsType) {
  const {
    icon,
    title,
    color = "#000000",
    fontSize = 20,
    backgroundColor = '#fff45c',
    tipsInnerStyle,
    iconStyle,
    onClick
  } = props;
  return (
    <View className='tips' style={{ fontSize, backgroundColor, ...tipsInnerStyle }} onClick={onClick}>
      <View className='tips-icon' style={iconStyle}>
        <AtIcon value={icon} size={fontSize} color={color}></AtIcon>
      </View>
      <Text>{title}</Text>
    </View>
  );
}
