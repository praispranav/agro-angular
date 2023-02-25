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
      FarmProfileImageBase64: ["", [Validators.required]],
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
      let formData = this.listJsForm.value;
      let payload = {
        FarmName: "Test Describtion for MasterCropName",
        FarmDescription: "Test Describtion for MasterCropName",
        FarmTypeID: 3,
        AreaSize: 4,
        OwnerName: "Prakash",
        Location: "Melaka",
        AreaSizeMeasurement: "hect",
        PhoneNumber: "Test Describtion for MasterCropName",
        Email: "Test Describtion for MasterCropName",
        FarmProfileImageBase64: null,
      };
      console.log("payload", payload);
      this.saveFarm(payload);
    }
    setTimeout(() => {
      this.listJsForm.reset();
    }, 2000);
    this.submitted = true;
  }

  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    this.ListJsDatas.forEach(
      (x: { state: any }) => (x.state = ev.target.checked)
    );
  }

  /**
   * Confirmation mail model
   */
  farmData: any;
  confirm(content: any, data: any) {
    this.farmData = data;
    this.modalService.open(content, { centered: true });
  }

  /**
   * Multiple Delete
   */
  checkedValGet: any[] = [];
  deleteMultiple(content: any) {
    var checkboxes: any = document.getElementsByName("checkAll");
    var result;
    var checkedVal: any[] = [];
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        result = checkboxes[i].value;
        checkedVal.push(result);
      }
    }
    if (checkedVal.length > 0) {
      this.modalService.open(content, { centered: true });
    } else {
      Swal.fire({
        text: "Please select at least one checkbox",
        confirmButtonColor: "#299cdb",
      });
    }
    this.checkedValGet = checkedVal;
  }

  // Delete Data
  deleteData() {
    let payload = {
      FarmID: this.farmData.farmID,
      FarmName: this.farmData.farmName,
    };
    this.deleteFarm(payload);
  }

  /**
   * Open modal
   * @param content modal content
   */
  editModal(content: any, id: any) {
    this.submitted = false;
    this.modalService.open(content, { size: "md", centered: true });
    var updateBtn = document.getElementById("add-btn") as HTMLAreaElement;
    var headingText = document.getElementById(
      "exampleModalLabel"
    ) as HTMLAreaElement;
    headingText.innerHTML = "Edit Crop Type";
    updateBtn.innerHTML = "Update";
    // var listData;
    // this.listItems.forEach((data) => {
    //   if (data.id === id) listData = data;
    // });
    var listData = this.ListJsDatas.filter(
      (data: { id: any }) => data.id === id
    );
    console.log("listData", listData);

    // this.listJsForm.controls["crop_name"].setValue(listData[0]?.crop_name);
    // this.listJsForm.controls["description"].setValue(listData[0]?.description);
    // this.listJsForm.controls["ids"].setValue(listData[0]?.id);
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

  UpdateFarm(payload: any): void {
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
