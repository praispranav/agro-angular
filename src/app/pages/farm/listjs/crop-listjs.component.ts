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
import { FarmInterface } from "./farm.interface";
import {
  NgbdOrdersSortableHeader,
  SortEvent,
} from "./crop-listjs-sortable.directive";

@Component({
  selector: "app-crop-listjs",
  templateUrl: "./crop-listjs.component.html",
  styleUrls: ["./crop-listjs.component.scss"],
  providers: [CropService, DecimalPipe],
})

/**
 * Listjs table Component
 */
export class CropListjsComponent {
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  submitted = false;
  listJsForm!: UntypedFormGroup;
  ListJsData!: CropListJsModel[];
  checkedList: any;
  cropSelected!: boolean;
  ListJsDatas: any;
  masterSelected!: boolean;
  farmTypeList: any;
  imageBase64: any;
  payload!: FarmInterface;
  farmTypeId: any;
  farmData!: any;
  AreaMeasurementList = ["Hectare", "Acre", "Square", "Meter", "Square yard"];

  // Table data
  ListJsList!: Observable<CropListJsModel[]>;
  total: Observable<number>;
  @ViewChildren(NgbdOrdersSortableHeader)
  headers!: QueryList<NgbdOrdersSortableHeader>;
  listItems: any[] = [];
  constructor(
    private modalService: NgbModal,
    public service: CropService,
    private formBuilder: UntypedFormBuilder
  ) {
    this.ListJsList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.getFarmList();
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: "Crop Type" },
      { label: "List", active: true },
    ];

    /**
     * Form Validation
     */
    this.listJsForm = this.formBuilder.group({
      FarmTypeID: ["", [Validators.required]],
      FarmName: ["", [Validators.required]],
      FarmDescription: ["", [Validators.required]],
      AreaSize: ["", [Validators.required]],
      OwnerName: ["", [Validators.required]],
      Location: ["", [Validators.required]],
      PhoneNumber: ["", [Validators.required]],
      Email: ["", [Validators.required]],
      FarmProfileImageBase64: [""],
      AreaSizeMeasurement: ["", [Validators.required]],
    });

    /**
     * fetches data
     */
    this.ListJsList.subscribe((x) => {
      this.ListJsDatas = Object.assign([], x);
    });
  }

  getFarmList(): void {
    this.service.getAll().subscribe(
      (res: any) => {
        this.listItems = res.data;
        console.log("res", res);
      },
      (err) => {
        console.log("err", err);
      }
    );
  }
  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.submitted = false;
    this.modalService.open(content, { size: "md", centered: true });
    this.getFarmType();
  }

  openFarmTypePopup(farmType: any): any {
    this.modalService.open(farmType, { size: "lg", centered: true });
  }

  getFarmType(): void {
    this.service.farmTypeList().subscribe(
      (res: any) => {
        this.farmTypeList = res.data;
      },
      (err) => {
        console.log("err", err);
      }
    );
  }

  farmTypeAdd(data: any) {
    this.farmTypeId = data.farmTypeId;
    this.listJsForm.controls["FarmTypeID"].setValue(data?.farmTypeName);
  }

  /**
   * Form data get
   */
  get form() {
    return this.listJsForm.controls;
  }

  selectFile(event: any): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imageBase64 = e.target.result;
    };
  }

  /**
   * Save saveListJs
   */
  saveListJs() {
    if (!this.listJsForm.valid) {
      return;
    } else {
      if (this.farmData?.masterCropID) {
        this.listJsForm.controls["FarmTypeID"].setValue(
          this.farmData.farmTypeId
        );
      } else {
        this.listJsForm.controls["FarmTypeID"].setValue(this.farmTypeId);
      }
      let formData = this.listJsForm.value;
      this.payload = {
        FarmName: formData.FarmName,
        FarmDescription: formData.FarmDescription,
        FarmTypeID: formData.FarmTypeID,
        AreaSize: formData.AreaSize,
        OwnerName: formData.OwnerName,
        Location: formData.Location,
        AreaSizeMeasurement: formData.AreaSizeMeasurement,
        PhoneNumber: formData.PhoneNumber,
        Email: formData.Email,
        FarmProfileImageBase64: this.imageBase64 ? this.imageBase64 : null,
      };
      console.log("payload", this.payload);
      if (this.farmData?.farmID) {
        this.payload.FarmID = this.farmData?.farmID;
        this.updateFarm(this.payload);
      } else {
        this.saveFarm(this.payload);
      }
    }
    setTimeout(() => {
      this.listJsForm.reset();
    }, 2000);
    this.submitted = true;
  }

  farmDeletData: any;
  confirm(content: any, data: any) {
    this.farmDeletData = data;
    this.modalService.open(content, { centered: true });
  }

  // Delete Data
  deleteData() {
    let payload = {
      FarmID: this.farmDeletData.farmID,
      FarmName: this.farmDeletData.farmName,
    };
    this.deleteFarm(payload);
  }

  resetForm(): void {
    this.listJsForm.reset();
  }

  /**
   * Open modal
   * @param content modal content
   */
  editModal(content: any, id: any) {
    this.submitted = false;
    this.listItems.forEach((element) => {
      if (id === element.farmID) {
        this.farmData = element;
      }
    });
    console.log("farmData", this.farmData);
    this.listJsForm.controls["FarmTypeID"].setValue(this.farmData.farmTypeName);
    this.listJsForm.patchValue({
      FarmName: this.farmData?.farmName ? this.farmData?.farmName : "",
      FarmDescription: this.farmData?.farmDescription
        ? this.farmData?.farmDescription
        : "",
      AreaSize: this.farmData?.areaSize ? this.farmData?.areaSize : "",
      OwnerName: this.farmData?.ownerName ? this.farmData?.ownerName : "",
      Location: this.farmData?.location ? this.farmData?.location : "",
      AreaSizeMeasurement: this.farmData?.areaSizeMeasurement
        ? this.farmData?.areaSizeMeasurement
        : "",
      PhoneNumber: this.farmData?.phoneNumber ? this.farmData?.phoneNumber : "",
      Email: this.farmData?.email ? this.farmData?.email : "",
      FarmProfileImageBase64: this.farmData?.farmProfilePicURL
        ? this.farmData?.farmProfilePicURL
        : "",
    });
    this.modalService.open(content, { size: "md", centered: true });
    var updateBtn = document.getElementById("add-btn") as HTMLAreaElement;
    var headingText = document.getElementById(
      "exampleModalLabel"
    ) as HTMLAreaElement;
    headingText.innerHTML = "Edit Farm Type";
    updateBtn.innerHTML = "Update";
  }

  saveFarm(payload: any): void {
    this.service.farmAdd(payload).subscribe(
      (res: any) => {
        console.log("res", res);
        this.modalService.dismissAll();
        this.getFarmList();
      },
      (err) => {
        console.log("err", err);
      }
    );
  }

  updateFarm(payload: any): void {
    this.service.farmUpdate(payload).subscribe(
      (res: any) => {
        console.log("res", res);
        this.getFarmList();
      },
      (err) => {
        console.log("err", err);
      }
    );
  }

  deleteFarm(payload: any): void {
    this.service.farmDelete(payload).subscribe(
      (res: any) => {
        console.log("res", res);
        this.getFarmList();
      },
      (err) => {
        console.log("err", err);
      }
    );
  }
}
