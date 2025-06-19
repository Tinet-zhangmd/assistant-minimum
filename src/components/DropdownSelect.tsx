import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, Modal, Dimensions, Pressable } from 'react-native';
import { ListItem, Icon } from '@rneui/themed';

export interface DropdownOption {
  label: string;
  value: any;
}

interface DropdownSelectProps {
  options: DropdownOption[];
  value: any;
  onChange: (value: any, idx: number) => void;
  placeholder?: string;
  style?: ViewStyle;
  dropdownWidth?: number;
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = '请选择',
  style,
  dropdownWidth = 110,
}) => {
  const [visible, setVisible] = React.useState(false);
  const [dropdownPos, setDropdownPos] = React.useState({ x: 0, y: 0, w: dropdownWidth, h: 0 });
  const btnRef = React.useRef<View | null>(null);
  const selectedIdx = options.findIndex(opt => opt.value === value);

  const openDropdown = () => {
    if (btnRef.current) {
      btnRef.current.measureInWindow((x: number, y: number, w: number, h: number) => {
        setDropdownPos({ x, y, w, h });
        setVisible(true);
      });
    }
  };

  const closeDropdown = () => setVisible(false);

  // 计算弹窗最大高度，防止超出屏幕
  const windowHeight = Dimensions.get('window').height;
  const maxDropdownHeight = Math.min(48 * options.length + 8, windowHeight - dropdownPos.y - dropdownPos.h - 32);

  return (
    <>
      <View ref={btnRef} collapsable={false} style={{ alignSelf: 'flex-start' }}>
        <TouchableOpacity
          style={[styles.dropdownBox, style, { minWidth: dropdownWidth }]}
          onPress={openDropdown}
          activeOpacity={0.8}
        >
          <Text style={styles.dropdownText} numberOfLines={1}>
            {selectedIdx >= 0 ? options[selectedIdx].label : placeholder}
          </Text>
          <Icon name="chevron-down" type="feather" color="#b0b0b0" size={20} style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={closeDropdown}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={closeDropdown} />
        <View
          style={[
            styles.dropdownOverlay,
            {
              position: 'absolute',
              top: dropdownPos.y + dropdownPos.h,
              left: dropdownPos.x,
              minWidth: dropdownPos.w,
              maxHeight: maxDropdownHeight,
            },
          ]}
        >
          {options.map((opt, idx) => (
            <ListItem
              key={String(opt.value) + '-' + idx}
              onPress={() => {
                onChange(opt.value, idx);
                closeDropdown();
              }}
              containerStyle={[
                styles.dropdownItem,
                value === opt.value && styles.dropdownItemActive,
              ]}
            >
              <ListItem.Content style={{ flexDirection: 'row', alignItems: 'center' }}>
                {value === opt.value && (
                  <Icon name="check" type="feather" color="#2979ff" size={18} style={{ marginRight: 8 }} />
                )}
                <ListItem.Title style={styles.dropdownItemText}>{opt.label}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  dropdownBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e3e7',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 90,
    marginLeft: 4,
  },
  dropdownText: {
    fontSize: 16,
    color: '#222',
    flexShrink: 1,
  },
  dropdownOverlay: {
    padding: 0,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    minWidth: 120,
    marginTop: 8,
    zIndex: 9999,
  },
  dropdownItem: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  dropdownItemActive: {
    backgroundColor: '#f6f8fa',
  },
  dropdownItemText: {
    fontSize: 18,
    color: '#222',
    fontWeight: '400',
  },
});

export default DropdownSelect; 