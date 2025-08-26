import { Routes } from "@angular/router";
import { StockListPage } from "./pages/stock-list.page";
import { StockFormPage } from "./pages/stock-form.page";
import { StockDetailPage } from "./pages/stock-detail.page";

export const STOCK_ROUTES: Routes = [
  { path: '', component: StockListPage },
  { path: 'novo', component: StockFormPage },
  { path: ':id/editar', component: StockFormPage },
  { path: ':id', component: StockDetailPage },
]