import {
  Box,
  Group,
  Text,
  NumberInput,
  ActionIcon,
  Stack,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useDispatch } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
} from "@/features/cart/model/cartSlice";
import { CUSTOMIZATION_PRICES, DISPLAY_NAMES, ShoePart } from "@/app/constants";
import { showToast } from "@/shared/lib/showToast";

type Props = {
  item: {
    id: string;
    model: string;
    size: string;
    quantity: number;
    price: number;
    customization?: Record<string, string>;
  };
};

export function CartItem({ item }: Props) {
  const dispatch = useDispatch();

  const customizationPrice = item.customization
    ? Object.entries(item.customization).reduce(
        (sum, [part]) => sum + CUSTOMIZATION_PRICES[part as ShoePart],
        0
      )
    : 0;

  const totalPrice = item.quantity * (item.price + customizationPrice);

  return (
    <Group justify="space-between" align="start" wrap="nowrap">
      <Box style={{ flexGrow: 1 }}>
        <Text fw={500}>{item.model}</Text>

        <Text size="sm" c="dimmed">
          Размер: {item.size}
        </Text>

        {item.customization && (
          <Stack gap={2} mt={4}>
            {Object.entries(item.customization).map(([part, color]) => (
              <Text size="xs" c="gray" key={part}>
                {DISPLAY_NAMES[part as ShoePart] || part}: {color}
              </Text>
            ))}
          </Stack>
        )}
      </Box>

      <NumberInput
        value={item.quantity}
        min={1}
        onChange={(val) =>
          dispatch(updateQuantity({ id: item.id, quantity: Number(val) || 1 }))
        }
        style={{ width: 60 }}
      />

      <Text size="sm" fw={600}>
        {totalPrice}₽
      </Text>

      <ActionIcon
        color="red"
        variant="light"
        onClick={() => {
          dispatch(removeFromCart(item.id));
          showToast("Удалено", "delete");
        }}
      >
        <IconTrash size={16} />
      </ActionIcon>
    </Group>
  );
}
