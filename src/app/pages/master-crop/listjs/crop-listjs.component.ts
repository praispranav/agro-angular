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
} from "./master-crop-listjs-sortable.directive";
import { MasterCropTypeInterface } from "./master-crop-type.interface";

@Component({
  selector: "app-master-crop-listjs",
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
  cropTypeList: any;
  cropTypeId!: string;
  cropTypeData: any;
  payload!: MasterCropTypeInterface;
  imageBase64: any;

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
    this.getMasterCropType();
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
      CropTypeId: ["", [Validators.required]],
      MasterCropName: ["", [Validators.required]],
      Description: ["", [Validators.required]],
      MasterCropProfileImageBase64: [""],
    });

    /**
     * fetches data
     */
    this.ListJsList.subscribe((x) => {
      this.ListJsDatas = Object.assign([], x);
    });
  }

  getMasterCropType(): void {
    this.service.getAll().subscribe(
      (res: any) => {
        this.listItems = res.data;
      },
      (err) => {
        console.log("err", err);
      }
    );
  }

  getCropType(): void {
    this.service.cropTypeList().subscribe(
      (res: any) => {
        this.cropTypeList = res.data;
      },
      (err) => {
        console.log("err", err);
      }
    );
  }

  selectFile(event: any): void {
    let file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageBase64 = e.target.result;
      };
    }
  }
  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.submitted = false;
    this.modalService.open(content, { size: "md", centered: true });
    this.getCropType();
  }

  openCropTypePopup(cropType: any): any {
    this.submitted = false;
    this.modalService.open(cropType, { size: "lg", centered: true });
  }

  /**
   * Form data get
   */
  get form() {
    return this.listJsForm.controls;
  }

  /**
   * Save saveListJs
   */
  saveListJs() {
    if (!this.listJsForm.valid) {
      return;
    } else {
      if (this.cropTypeData?.masterCropID) {
        this.listJsForm.controls["CropTypeId"].setValue(
          this.cropTypeData.cropTypeId
        );
      } else {
        this.listJsForm.controls["CropTypeId"].setValue(this.cropTypeId);
      }
      let formData = this.listJsForm.value;
      this.payload = {
        CropTypeId: formData.CropTypeId,
        MasterCropName: formData.MasterCropName,
        Description: formData.Description,
        MasterCropProfileImageBase64: this.imageBase64
          ? this.imageBase64
          : null,
      };
      console.log("payload", this.payload);
      if (this.cropTypeData?.masterCropID) {
        this.payload.MasterCropID = this.cropTypeData?.masterCropID;
        this.UpdateCrop(this.payload);
      } else {
        this.saveCrop(this.payload);
      }
    }
    setTimeout(() => {
      this.listJsForm.reset();
    }, 2000);
    this.submitted = true;
  }

  cropTypeAdd(data: any): void {
    this.cropTypeId = data.cropTypeId;
    this.listJsForm.controls["CropTypeId"].setValue(data?.cropTypeName);
    // this.modalService.dismissAll();
  }

  deleteId: any;
  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

  // Delete Data
  deleteData(id: any) {
    let payload = {
      MasterCropID: this.deleteId,
    };
    this.deleteCrop(payload);
  }

  /**
   * Open modal
   * @param content modal content
   */
  editModal(content: any, id: any) {
    this.submitted = false;
    this.listItems.forEach((element) => {
      if (id === element.masterCropID) {
        this.cropTypeData = element;
      }
    });
    console.log("cropTypeData", this.cropTypeData);
    this.listJsForm.controls["CropTypeId"].setValue(
      this.cropTypeData.cropTypeName
    );
    this.imageBase64 = this.cropTypeData?.masterCropProfilePicURL ? this.cropTypeData?.masterCropProfilePicURL : '';
    this.listJsForm.patchValue({
      MasterCropName: this.cropTypeData?.masterCropName
        ? this.cropTypeData?.masterCropName
        : "",
      Description: this.cropTypeData?.masterCropDescription
        ? this.cropTypeData?.masterCropDescription
        : "",
    });
    this.modalService.open(content, { size: "md", centered: true });
    var updateBtn = document.getElementById("add-btn") as HTMLAreaElement;
    var headingText = document.getElementById(
      "exampleModalLabel"
    ) as HTMLAreaElement;
    headingText.innerHTML = "Edit Master Crop";
    updateBtn.innerHTML = "Update";
  }

  resetForm(): void {
    this.listJsForm.reset();
  }

  saveCrop(payload: any): void {
    this.service.masterCropTypeAdd(payload).subscribe(
      (res: any) => {
        this.modalService.dismissAll();
        this.getMasterCropType();
      },
      (err) => {
        console.log("err", err);
      }
    );
  }

  deleteCrop(payload: any): void {
    this.service.masterCropTypeDelete(payload).subscribe(
      (res: any) => {
        this.getMasterCropType();
      },
      (err) => {
        console.log("err", err);
      }
    );
  }

  UpdateCrop(payload: any): void {
    this.service.masterCropTypeUpdate(payload).subscribe(
      (res: any) => {
        this.modalService.dismissAll();
        this.getMasterCropType();
      },
      (err) => {
        console.log("err", err);
      }
    );
  }
}
