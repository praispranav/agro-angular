import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  NgbDropdownModule,
  NgbPaginationModule,
  NgbTypeaheadModule,
} from "@ng-bootstrap/ng-bootstrap";
import { HttpClientModule } from "@angular/common/http";

// FlatPicker
import { FlatpickrModule } from "angularx-flatpickr";

// Load Icon
import { defineElement } from "lord-icon-element";
import lottie from "lottie-web";

// Component pages
import { LookupsRoutingModule } from "./lookups-routing.module";
import { SharedModule } from "../../shared/shared.module";

import { CropListjsComponent } from "./listjs/crop-listjs.component";
import { NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
// Sorting page
//import { NgbdGridJsSortableHeader } from './../tables/gridjs/gridjs-sortable.directive';

@NgModule({
  declarations: [
    CropListjsComponent,
    // NgbdGridJsSortableHeader
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    FlatpickrModule,
    LookupsRoutingModule,
    SharedModule,
    NgbNavModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LookupsModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
