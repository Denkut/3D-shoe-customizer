import { Container, Title, Stack, Text, Divider, Paper } from "@mantine/core";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store";
import { useNavigate } from "react-router-dom";
import { ShoePart, CUSTOMIZATION_PRICES, DISPLAY_NAMES } from "@/app/constants";
import { clearCart } from "@/features/cart/model/cartSlice";
import { useEffect } from "react";
import { showToast } from "@/shared/lib/showToast";
import { CheckoutForm } from "./CheckoutForm";

export function CheckoutPage() {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length === 0) {
      navigate("/");
    }
  }, [items.length, navigate]);

  const total = items.reduce((sum, item) => {
    const customizationPrice = item.customization
      ? Object.entries(item.customization).reduce(
          (s, [part]) => s + CUSTOMIZATION_PRICES[part as ShoePart],
          0
        )
      : 0;
    return sum + item.quantity * (item.price + customizationPrice);
  }, 0);

  const handleConfirm = () => {
    showToast("Заказ успешно оформлен!", "success");
    dispatch(clearCart());
    navigate("/");
  };

  return (
    <Container size="md" my="xl">
      <Title order={2} mb="md">
        Оформление заказа
      </Title>

      <Paper withBorder p="md" radius="md">
        <Stack gap="xs">
          {items.map((item) => (
            <div key={item.id}>
              <Text fw={500}>
                {item.model} (размер: {item.size})
              </Text>
              <Text size="sm" c="dimmed">
                Кол-во: {item.quantity} — Цена: {item.price}₽
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
              <Divider my="sm" />
            </div>
          ))}
        </Stack>
        <Text fw={600}>Итого: {total}₽</Text>
      </Paper>

      <Title order={4} mt="xl">
        Данные покупателя
      </Title>
      <CheckoutForm onSubmit={handleConfirm} />
    </Container>
  );
}
