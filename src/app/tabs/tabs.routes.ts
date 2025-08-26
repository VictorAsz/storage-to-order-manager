import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
     {
        path: 'estoque',
        loadChildren: () => import('../features/stock/stock.routes').then(r => r.STOCK_ROUTES)
      },
      {
        path: 'pedidos',
        loadChildren: () => import('../features/orders/orders.route').then(m => m.ORDERS_ROUTES)
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/estoque',
    pathMatch: 'full',
  },
];