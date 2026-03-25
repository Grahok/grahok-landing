import { TCustomerDetailsInOrder } from "@/features/orders/types/orderTypes";
import {
  LandingPageGetPayload,
  OrderItemModel,
  OrderModel,
  ProductModel,
} from "@/generated/prisma/models";
import { createContext, useContext, useMemo, useState } from "react";
import { LandingPageProductFaqsType } from "../types/landingPageTypes";
import { toast } from "sonner";

export type LandingPageProductWithTypedFaqs = Omit<
  LandingPageGetPayload<{
    include: {
      landingPageProducts: {
        include: {
          product: true;
        };
      };
    };
  }>["landingPageProducts"][number],
  "faqs"
> & {
  faqs: LandingPageProductFaqsType;
};

type LandingPage = Omit<
  LandingPageGetPayload<{
    include: {
      landingPageProducts: {
        include: {
          product: true;
        };
      };
    };
  }>,
  "landingPageProducts"
> & {
  landingPageProducts: LandingPageProductWithTypedFaqs[];
};

export type CartItem = {
  // productId: OrderItemModel["productId"];
  product: ProductModel;
  quantity: OrderItemModel["quantity"];
};

type CustomerDetails = {
  name: TCustomerDetailsInOrder["name"];
  mobileNumber: TCustomerDetailsInOrder["mobileNumber"];
  address: TCustomerDetailsInOrder["address"];
};

type ShippingRegion = "inside-dhaka" | "outside-dhaka";

type OrderDetails = {
  orderId: OrderModel["id"];
  cartItems: CartItem[];
  customerDetails: CustomerDetails;
  totalAmount: number;
};

export type LandingPageContextType = {
  landingPage: LandingPage;

  // Cart Itens
  cartItems: CartItem[];
  addToCart: (
    product: CartItem["product"],
    quantity: CartItem["quantity"],
  ) => void;
  removeFromCart: (productId: CartItem["product"]["id"]) => void;
  incrementCartItemQuantity: (productId: CartItem["product"]["id"]) => void;
  decrementCartItemQuantity: (productId: CartItem["product"]["id"]) => void;
  updateCartItemQuantity: (
    productId: CartItem["product"]["id"],
    quantity: CartItem["quantity"],
  ) => void;
  clearCart: () => void;
  productPresentInCart: (productId: CartItem["product"]["id"]) => boolean;
  productsNotPresentInCart: LandingPageProductWithTypedFaqs[];

  // Customer Information
  customerDetails: CustomerDetails;
  setCustomerDetails: (customerDetails: CustomerDetails) => void;

  // Shipping
  shippingRegion: ShippingRegion;
  setShippingRegion: (region: ShippingRegion) => void;
  getShippingCharge: () => number;

  // Order Success Modal
  isOrderSuccessModalOpen: boolean;
  setIsOrderSuccessModalOpen: (isOpen: boolean) => void;
  orderDetails: OrderDetails | null;
  setOrderDetails: (orderDetails: OrderDetails | null) => void;
};

export const LandingPageContext = createContext<LandingPageContextType | null>(
  null,
);

export const LandingPageProvider = ({
  children,
  landingPage,
}: {
  children: React.ReactNode;
  landingPage: LandingPage;
}) => {
  // Cart Itens
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const addToCart = (
    product: CartItem["product"],
    quantity: CartItem["quantity"],
  ) => {
    if (productPresentInCart(product.id)) {
      toast.error("Product already in cart");
      return;
    }
    setCartItems((prev) => [...prev, { product, quantity }]);
    toast.success("Product added to cart");
  };
  const removeFromCart = (productId: CartItem["product"]["id"]) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product.id !== productId),
    );
    toast.success("Product removed from cart");
  };
  const incrementCartItemQuantity = (productId: CartItem["product"]["id"]) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };
  const decrementCartItemQuantity = (productId: CartItem["product"]["id"]) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    );
  };
  const updateCartItemQuantity = (
    productId: CartItem["product"]["id"],
    quantity: CartItem["quantity"],
  ) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    );
  };
  const clearCart = () => {
    setCartItems([]);
  };

  const productPresentInCart = (productId: CartItem["product"]["id"]) => {
    return cartItems.some((item) => item.product.id === productId);
  };

  const productsNotPresentInCart = landingPage.landingPageProducts.filter(
    (item) => !productPresentInCart(item.product.id),
  );

  // Customer Information
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: "",
    mobileNumber: "",
    address: "",
  });

  // Shipping
  const [shippingRegion, setShippingRegion] =
    useState<ShippingRegion>("inside-dhaka");
  const getShippingCharge = () => {
    return shippingRegion === "inside-dhaka"
      ? landingPage.shippingInsideDhaka
      : landingPage.shippingOutsideDhaka;
  };

  // Order Success Modal
  const [isOrderSuccessModalOpen, setIsOrderSuccessModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  const contextValue = useMemo(
    () => ({
      landingPage,
      cartItems,
      addToCart,
      removeFromCart,
      incrementCartItemQuantity,
      decrementCartItemQuantity,
      updateCartItemQuantity,
      clearCart,
      productPresentInCart,
      productsNotPresentInCart,
      customerDetails,
      setCustomerDetails,
      shippingRegion,
      setShippingRegion,
      getShippingCharge,
      isOrderSuccessModalOpen,
      setIsOrderSuccessModalOpen,
      orderDetails,
      setOrderDetails,
    }),
    [
      landingPage,
      cartItems,
      addToCart,
      removeFromCart,
      incrementCartItemQuantity,
      decrementCartItemQuantity,
      updateCartItemQuantity,
      clearCart,
      productPresentInCart,
      productsNotPresentInCart,
      customerDetails,
      setCustomerDetails,
      shippingRegion,
      setShippingRegion,
      getShippingCharge,
      isOrderSuccessModalOpen,
      setIsOrderSuccessModalOpen,
      orderDetails,
      setOrderDetails,
    ],
  );

  return (
    <LandingPageContext.Provider value={contextValue}>
      {children}
    </LandingPageContext.Provider>
  );
};

export const useLandingPage = () => {
  const context = useContext(LandingPageContext);
  if (!context) {
    throw new Error("useLandingPage must be used within a LandingPageProvider");
  }
  return context;
};
