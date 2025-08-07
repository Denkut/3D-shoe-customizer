import { ShoeScene } from "@/widgets/shoe-shelf/ShoeScene";
import { ShoppingCart } from "@/widgets/shopping-cart/ShoppingCart";
import { ShoeCustomizerUI } from "@/widgets/shoe-shelf/ShoeCustomizerUI";

export function HomePage() {
  return (
    <div style={{ height: "100vh", position: "relative" }}>
      <ShoeScene />
      <ShoppingCart />
      <ShoeCustomizerUI />
    </div>
  );
}
