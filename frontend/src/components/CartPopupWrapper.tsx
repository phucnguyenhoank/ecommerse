import React from "react";
import { useCart } from "../contexts/CartContext";
import ShoppingCartPopup from "./ShoppingCartPopup";

const CartPopupWrapper = ({
  cartOpen,
  setCartOpen,
}: {
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}) => {
  const { cart, updateQuantity, removeItem } = useCart(); 

  return (
    <ShoppingCartPopup
      isOpen={cartOpen}
      onClose={() => setCartOpen(false)}
      cartItems={cart}
      updateQuantity={updateQuantity} 
      removeItem={removeItem}
    />
  );
};

export default CartPopupWrapper;
