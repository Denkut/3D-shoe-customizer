import { Card, Title, Divider, Stack, Text, Button } from "@mantine/core";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { CartItem } from "./CartItem";
import { CUSTOMIZATION_PRICES, ShoePart } from "@/app/constants";
import { useNavigate } from "react-router-dom";

export function ShoppingCart() {
  const items = useSelector((state: RootState) => state.cart.items);
  const navigate = useNavigate();

  const total = items.reduce((sum, item) => {
    const customizationPrice = item.customization
      ? Object.entries(item.customization).reduce(
          (s, [part]) => s + CUSTOMIZATION_PRICES[part as ShoePart],
          0
        )
      : 0;

    return sum + item.quantity * (item.price + customizationPrice);
  }, 0);

  return (
    <Card
      shadow="md"
      radius="md"
      p="lg"
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        width: 400,
        zIndex: 10,
      }}
    >
      <Title order={4}>Корзина</Title>
      <Divider my="sm" />
      <Stack gap="sm">
        {items.length === 0 ? (
          <Text size="sm" c="dimmed">
            Корзина пуста
          </Text>
        ) : (
          items.map((item) => <CartItem key={item.id} item={item} />)
        )}
      </Stack>
      <Divider my="sm" />
      <Text>Итого: {total}₽</Text>
      {items.length > 0 && (
        <Button
          fullWidth
          mt="sm"
          color="blue"
          onClick={() => navigate("/checkout")}
        >
          Оформить заказ
        </Button>
      )}
    </Card>
  );
}
