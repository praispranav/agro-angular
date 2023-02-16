import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

// Component pages
import { DashboardComponent } from "./dashboards/dashboard/dashboard.component";

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
  },
  {
    path: "",
    loadChildren: () =>
      import("./dashboards/dashboards.module").then((m) => m.DashboardsModule),
  },
  {
    path: "apps",
    loadChildren: () => import("./apps/apps.module").then((m) => m.AppsModule),
  },
  {
    path: "ecommerce",
    loadChildren: () =>
      import("./ecommerce/ecommerce.module").then((m) => m.EcommerceModule),
  },
  {
    path: "projects",
    loadChildren: () =>
      import("./projects/projects.module").then((m) => m.ProjectsModule),
  },
  {
    path: "tasks",
    loadChildren: () =>
      import("./tasks/tasks.module").then((m) => m.TasksModule),
  },
  {
    path: "crm",
    loadChildren: () => import("./crm/crm.module").then((m) => m.CrmModule),
  },
  {
    path: "crypto",
    loadChildren: () =>
      import("./crypto/crypto.module").then((m) => m.CryptoModule),
  },
  {
    path: "invoices",
    loadChildren: () =>
      import("./invoices/invoices.module").then((m) => m.InvoicesModule),
  },
  {
    path: "tickets",
    loadChildren: () =>
      import("./tickets/tickets.module").then((m) => m.TicketsModule),
  },
  {
    path: "pages",
    loadChildren: () =>
      import("./extrapages/extraspages.module").then(
        (m) => m.ExtraspagesModule
      ),
  },
  {
    path: "ui",
    loadChildren: () => import("./ui/ui.module").then((m) => m.UiModule),
  },
  {
    path: "advance-ui",
    loadChildren: () =>
      import("./advance-ui/advance-ui.module").then((m) => m.AdvanceUiModule),
  },
  {
    path: "forms",
    loadChildren: () => import("./form/form.module").then((m) => m.FormModule),
  },
  {
    path: "tables",
    loadChildren: () =>
      import("./tables/tables.module").then((m) => m.TablesModule),
  },
  {
    path: "charts",
    loadChildren: () =>
      import("./charts/charts.module").then((m) => m.ChartsModule),
  },
  {
    path: "icons",
    loadChildren: () =>
      import("./icons/icons.module").then((m) => m.IconsModule),
  },
  {
    path: "maps",
    loadChildren: () => import("./maps/maps.module").then((m) => m.MapsModule),
  },
  {
    path: "marletplace",
    loadChildren: () =>
      import("./nft-marketplace/nft-marketplace.module").then(
        (m) => m.NftMarketplaceModule
      ),
  },
  {
    path: "crop",
    loadChildren: () =>
      import("./crop-type/crop-type.module").then((m) => m.CropTypeModule),
  },
  {
    path: "master-crop",
    loadChildren: () =>
      import("./master-crop/master-crop.module").then(
        (m) => m.MasterCropModule
      ),
  },
  {
    path: "crop-one",
    loadChildren: () =>
      import("./crop-one/crop-one.module").then((m) => m.CropOneModule),
  },
  {
    path: "crop-two",
    loadChildren: () =>
      import("./crop-two/crop-two.module").then((m) => m.CropTwoModule),
  },
  {
    path: "crop-three",
    loadChildren: () =>
      import("./crop-three/crop-three.module").then((m) => m.CropThreeModule),
  },
  {
    path: "crop-four",
    loadChildren: () =>
      import("./crop-four/crop-four.module").then((m) => m.CropFourModule),
  },
  {
    path: "crop-five",
    loadChildren: () =>
      import("./crop-five/crop-five.module").then((m) => m.CropFiveModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
