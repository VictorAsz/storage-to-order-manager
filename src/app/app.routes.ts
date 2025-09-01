import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
   {
    path: 'estoque', 
    loadChildren: () => import('./features/stock/stock.routes').then(m => m.STOCK_ROUTES)
  },
  {
    path: 'pedidos', 
    loadChildren: () => import('./features/orders/orders.route').then(m => m.ORDERS_ROUTES)
  }
];
