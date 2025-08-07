import {
  Button,
  ColorInput,
  Title,
  Stack,
  Box,
  Table,
  Tooltip,
  Group,
  Text,
} from "@mantine/core";
import { useCustomizeStore } from "@/features/customize-shoe/useCustomizeStore";
import {
  DISPLAY_NAMES,
  CUSTOMIZATION_PRICES,
  BASE_PRICES,
} from "@/app/constants";
import { useDispatch } from "react-redux";
import { addToCart } from "@/features/cart/model/cartSlice";
import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { IconBrush } from "@tabler/icons-react";
import { showToast } from "@/shared/lib/showToast";

export function ShoeCustomizerUI() {
  const dispatch = useDispatch();
  const {
    selectedMesh,
    selectedModelName,
    editableParts,
    currentPart,
    colorMap,
    confirmedColors,
    setCurrentPart,
    setColorForPart,
    confirmColor,
    resetAllForMesh,
  } = useCustomizeStore();

  const meshKey = selectedMesh?.userData.meshKey as string | undefined;

  const priceBase = BASE_PRICES[selectedModelName] || 3000;

  const customizationRows = useMemo(() => {
    if (!meshKey || !selectedMesh) return [];
    return editableParts.map((part) => {
      const color =
        colorMap[`${meshKey}-${part}`] ??
        confirmedColors[`${meshKey}-${part}`] ??
        "#ffffff";
      return {
        part,
        displayName: DISPLAY_NAMES[part],
        color,
        price: CUSTOMIZATION_PRICES[part],
      };
    });
  }, [editableParts, meshKey, colorMap, confirmedColors, selectedMesh]);

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: "Часть",
        accessorKey: "displayName",
        cell: (info) => {
          const row = info.row.original;
          return (
            <Group gap={6}>
              <IconBrush size={16} stroke={1.5} />
              <span>{row.displayName}</span>
            </Group>
          );
        },
      },
      {
        header: "Цвет",
        accessorKey: "color",
        cell: (info) => {
          const color = info.getValue() as string;
          return (
            <Tooltip label={color}>
              <Box
                w={20}
                h={20}
                style={{
                  backgroundColor: color,
                  borderRadius: "50%",
                  border: "1px solid #ccc",
                }}
              />
            </Tooltip>
          );
        },
      },
      {
        header: "Цена",
        accessorKey: "price",
        cell: (info) => `${info.getValue()}₽`,
      },
    ],
    []
  );

  const table = useReactTable({
    data: customizationRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!selectedMesh || !meshKey) return null;

  const customization = Object.fromEntries(
    Object.entries(confirmedColors)
      .filter(([k]) => k.startsWith(meshKey))
      .map(([k, color]) => {
        const part = k.replace(`${meshKey}-`, "");
        return [part, color];
      })
  );

  return (
    <div style={{ position: "absolute", top: 16, left: 16, zIndex: 10 }}>
      <Title order={5}>{`Модель: ${selectedModelName}`}</Title>
      <Text size="sm" c="dimmed">
        Размер: {selectedMesh.userData.size}
      </Text>
      <Stack>
        <ColorInput
          label="Выбери цвет"
          value={
            colorMap[`${meshKey}-${currentPart}`] ??
            confirmedColors[`${meshKey}-${currentPart}`] ??
            "#ffffff"
          }
          onChange={(c) => setColorForPart(currentPart, meshKey, c)}
        />

        <Table striped highlightOnHover withTableBorder>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              const isActive = row.original.part === currentPart;
              return (
                <tr
                  key={row.id}
                  onClick={() => setCurrentPart(row.original.part)}
                  style={{
                    backgroundColor: isActive ? "#e6f7ff" : undefined,
                    cursor: "pointer",
                    borderLeft: isActive ? "4px solid #228be6" : undefined,
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>

        <Button
          onClick={() => {
            confirmColor(meshKey);
            showToast("Изменения применены", "info");
          }}
        >
          Применить
        </Button>

        <Button
          color="red"
          variant="outline"
          onClick={() => {
            resetAllForMesh(meshKey);
            showToast("Все цвета сброшены", "delete");
          }}
        >
          Сбросить все цвета
        </Button>

        <Button
          color="green"
          onClick={() => {
            dispatch(
              addToCart({
                model: selectedModelName,
                size: selectedMesh.userData.size,
                price: priceBase,
                customizable: true,
                customization,
              })
            );
            showToast("Добавлено в корзину", "success");
          }}
        >
          В корзину
        </Button>
      </Stack>
    </div>
  );
}
