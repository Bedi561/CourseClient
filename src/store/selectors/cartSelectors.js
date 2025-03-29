import { selector } from 'recoil';
import { cartState } from '../atoms/cartAtom';

export const cartItemsCountSelector = selector({
  key: 'cartItemsCount',
  get: ({ get }) => {
    const cart = get(cartState);
    return cart.length;
  },
});

export const cartTotalSelector = selector({
  key: 'cartTotal',
  get: ({ get }) => {
    const cart = get(cartState);
    return cart.reduce((total, item) => total + item.price, 0);
  },
});

