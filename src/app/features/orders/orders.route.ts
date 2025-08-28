import { Routes } from '@angular/router';
import { OrdersListPage } from './pages/orders-list.page';
import { OrdersFormPage } from './pages/order-form.page';
import { OrdersDetailPage } from './pages/order-detail-page';


export const ORDERS_ROUTES: Routes = [
  { path: '', component: OrdersListPage },
  { path: 'novo', component: OrdersFormPage },
  { path: ':id', component: OrdersDetailPage },
//{ path: ':id/editar', component: OrdersFormPage }, 
];
