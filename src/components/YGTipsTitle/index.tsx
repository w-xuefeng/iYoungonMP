import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import "./index.scss";

interface YGTipsTitlePropsType {
  icon: string;
  title: string;
  width?: string;
  color?: string;
  fontSize?: number;
  backgroundColor?: string;
}
export default function YGTipsTitle(props: YGTipsTitlePropsType) {
  const {
    icon,
    title,
    width = "30%",
    color = "#000000",
    fontSize = 20,
    backgroundColor = '#fff45c'
  } = props;
  return (
    <View className='tips' style={{ width, fontSize, backgroundColor }}>
      <View className='tips-icon'>
        <AtIcon value={icon} size={fontSize} color={color}></AtIcon>
      </View>
      <Text>{title}</Text>
    </View>
  );
}
