
import React from 'react';
import Shop from '@/pages/Shop';
import { Cart } from '@/components/shop/Cart';
import OrderSuccess from '@/components/shop/OrderSuccess';
import ShopItemDetails from '@/components/shop/ShopItemDetails';

export const getRouteComponent = (path: string) => {
  switch (path) {
    case '':
      return <Shop />;
    case 'cart':
      return <Cart />;
    case 'order-success':
      return <OrderSuccess />;
    case 'item/detail':
      return <ShopItemDetails />;
    default:
      return null;
  }
};
