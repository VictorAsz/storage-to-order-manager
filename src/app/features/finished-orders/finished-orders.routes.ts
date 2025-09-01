import { Routes } from "@angular/router";
import { FinishedOrdersPage } from "./pages/finished-orders-list.page";
import { FinisheOrderDetailPage } from "./pages/finished-orders-detail.page";

export const FINISHED_ORDERS: Routes = [
    { path: '', component: FinishedOrdersPage},
    { path: ':id', component: FinisheOrderDetailPage},
]