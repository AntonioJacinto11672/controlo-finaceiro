import React from 'react';
import { Text, View } from 'react-native';

type StatusTone = 'success' | 'danger' | 'pending';

interface StatusBadgeProps {
  label: string;
  tone: StatusTone;
}

const TONE_STYLES: Record<StatusTone, { bg: string; text: string }> = {
  success: { bg: 'bg-[#00875F]', text: 'text-white' },
  danger: { bg: 'bg-[#AA2834]', text: 'text-white' },
  pending: { bg: 'bg-[#F5A623]', text: 'text-[#121214]' },
};

const StatusBadge = ({ label, tone }: StatusBadgeProps) => {
  const style = TONE_STYLES[tone];
  return (
    <View className={`px-3 py-1 rounded-full self-start ${style.bg}`}>
      <Text className={`text-xs font-bold ${style.text}`}>{label}</Text>
    </View>
  );
};

export default StatusBadge;
