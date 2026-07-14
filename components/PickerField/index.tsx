import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type Option<T extends string> = { value: T; label: string };

interface PickerFieldProps<T extends string> {
  label?: string;
  options: Option<T>[];
  value: T | undefined;
  onChange: (value: T) => void;
}

function PickerField<T extends string>({ label, options, value, onChange }: PickerFieldProps<T>) {
  return (
    <View className="mb-4">
      {label && <Text className="text-gray-100 ml-1 mb-2">{label}</Text>}
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const isActive = option.value === value;
          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => onChange(option.value)}
              className={`px-4 py-3 rounded-md border ${
                isActive ? 'bg-[#00875F] border-[#00875F]' : 'bg-[#121214] border-[#323238]'
              }`}
            >
              <Text className={isActive ? 'text-white font-semibold' : 'text-gray-300'}>{option.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default PickerField;
