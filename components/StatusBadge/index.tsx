import React from 'react';
import { Text, View } from 'react-native';

type StatusBadgeProps = {
  label: string;
  color: string;
};

const StatusBadge = ({ label, color }: StatusBadgeProps) => {
  return (
    <View className="px-3 py-1 rounded-full" style={{ backgroundColor: `${color}26` }}>
      <Text className="text-xs font-bold" style={{ color }}>
        {label}
      </Text>
    </View>
  );
};

export default StatusBadge;
