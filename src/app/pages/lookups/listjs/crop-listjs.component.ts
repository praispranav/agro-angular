import { Component, QueryList, ViewChildren } from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { Observable } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  FormArray,
  Validators,
} from "@angular/forms";

// Sweet Alert
import Swal from "sweetalert2";

import { CropListJsModel } from "./crop-listjs.model";
import { ListJs } from "./data";
import { CropService } from "./crop-listjs.service";
import {
  NgbdOrdersSortableHeader,
  SortEvent,
} from "./lookups-listjs-sortable.directive";

@Component({
  selector: "app-lookups",
  templateUrl: "./crop-listjs.component.html",
  styleUrls: ["./crop-listjs.component.scss"],
  providers: [CropService, DecimalPipe],
})

/**
 * Listjs table Component
 */
export class CropListjsComponent {
  list: any[] = [];

  constructor(private modalService: NgbModal, public service: CropService) {}

  ngOnInit(): void {
    this.getCropType();
  }

  navClick(type:string) {
    if (type === "cropType") {
      this.getCropType(); 
    } else if (type === "soilType") {
      this.getSoilType();
    } else if (type === "varietyType") {
      this.getVarietyType();
    } else if (type === "yieldType") {
      this.getYieldType();
    } else if (type === "irrigationType") {
      this.getIrrigationType();
    } else if (type === "masterCropType") {
      this.getMasterCropType();
    }
  }

  getMasterCropType(): void {
    this.service.masterCropList().subscribe(
      (res: any) => {
        this.list = res.data;
      },
      (err) => {
        console.log("err", err);
      }
    );
  }

  getCropType(): void {
    this.service.cropTypeList().subscribe(
      (res: any) => {
        this.list = res.data;
      },
      (err) => {
        console.log("err", err);
      }
    );
  }

  getIrrigationType(): void {
    this.service.irrigationList().subscribe(
      (res: any) => {
        this.list = res.data;
      },
      (err) => {
        console.log("err", err);
      }
    );
  }

  getYieldType(): void {
    this.service.yieldTypeList().subscribe(
      (res: any) => {
        this.list = res.data;
      },
      (err) => {
        console.log("err", err);
      }
    );
  }

  getVarietyType(): void {
    this.service.varietyTypeList().subscribe(
      (res: any) => {
        this.list = res.data;
      },
      (err) => {
        console.log("err", err);
      }
    );
  }

  getSoilType(): void {
    this.service.soilTypeList().subscribe(
      (res: any) => {
        this.list = res.data;
      },
      (err) => {
        console.log("err", err);
      }
    );
  }
}
