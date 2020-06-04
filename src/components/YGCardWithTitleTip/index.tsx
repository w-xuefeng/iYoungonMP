import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import YGTipsTitle from '@/components/YGTipsTitle'
import './index.scss'

interface YGCardWithTitleTipPropsType {
  icon: string;
  title: string;
  tipsInnerStyle?: Record<string, string | number>;
  tipsStyle?: Record<string, string | number>;
  itemStyle?: Record<string, string | number>;
  cardStyle?: Record<string, string | number>;
  cardWidth?: string;
  children?: any;
}
export default function YGCardWithTitleTip(props: YGCardWithTitleTipPropsType) {
  const {
    icon,
    title,
    tipsInnerStyle,
    tipsStyle = { left: '0', top: '0' },
    cardStyle,
    itemStyle,
    cardWidth = '100%',
    children
  } = props;
  return (
    <View className='item' style={itemStyle}>
      <View className='item-tips' style={tipsStyle}>
        <YGTipsTitle icon={icon} title={title} tipsInnerStyle={tipsInnerStyle} />
      </View>
      <View className='item-card' style={{ ...cardStyle, width: cardWidth }}>
        {children}
      </View>
    </View>
  );
}
