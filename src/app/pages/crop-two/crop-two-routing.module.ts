import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component pages

import { CropListjsComponent } from "./listjs/crop-listjs.component";

const routes: Routes = [
 
  {
    path: "crop-two-listjs",
    component: CropListjsComponent
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CropTwoRoutingModule { }
