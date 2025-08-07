import { TextInput, Button, Stack, Group } from "@mantine/core";
import { useForm } from "@mantine/form";

type Props = {
  onSubmit: () => void;
};

export function CheckoutForm({ onSubmit }: Props) {
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      address: "",
    },

    validate: {
      name: (value) => (value.trim().length < 2 ? "Введите имя" : null),
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Введите корректный email",
      address: (value) =>
        value.trim().length < 5 ? "Введите адрес доставки" : null,
    },
  });

  const handleSubmit = () => {
    if (form.validate().hasErrors) return;
    onSubmit();
    form.reset();
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack mt="md">
        <TextInput
          label="ФИО"
          placeholder="Иванов Иван"
          required
          {...form.getInputProps("name")}
        />
        <TextInput
          label="Email"
          placeholder="ivan@example.com"
          required
          {...form.getInputProps("email")}
        />
        <TextInput
          label="Адрес доставки"
          placeholder="г. N, ул. Пушкина, 1"
          required
          {...form.getInputProps("address")}
        />
      </Stack>

      <Group justify="flex-end" mt="xl">
        <Button type="submit" color="green">
          Подтвердить заказ
        </Button>
      </Group>
    </form>
  );
}
