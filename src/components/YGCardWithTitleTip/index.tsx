import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import YGTipsTitle from '@/components/YGTipsTitle'
import "./index.scss"

interface Position {
  top?: string;
  botttom?: string;
  left?: string;
  right?: string;
}
interface YGCardWithTitleTipPropsType {
  icon: string;
  title: string;
  tipsPosition?: Position;
  cardPosition?: Position;
  cardWidth?: string;
  children?: any;
}
export default function YGCardWithTitleTip(props: YGCardWithTitleTipPropsType) {
  const {
    icon,
    title,
    tipsPosition = { left: '0', top: '0' },
    cardPosition = { left: '0', top: '50px' },
    cardWidth = '100%',
    children
  } = props;
  return (
    <View className='item'>
      <View className='item-tips' style={tipsPosition}>
        <YGTipsTitle icon={icon} title={title} />
      </View>
      <View className='item-card' style={{ ...cardPosition, width: cardWidth }}>
        {children}
      </View>
    </View>
  );
}
