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
} from "./crop-four-listjs-sortable.directive";

@Component({
  selector: "app-crop-four-listjs",
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
  irrigationTypeList: any;
  cropTypeId!: string;

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
      ids: [""],
      cropTypeId: ["", [Validators.required]],
      masterCrop_name: ["", [Validators.required]],
      description: ["", [Validators.required]],
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

  getIrrigationType(): void {
    this.service.irrigationTypeList().subscribe(
      (res: any) => {
        this.irrigationTypeList = res.data;
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
    this.getIrrigationType();
  }

  openIrrigationTypePopup(irrigationType: any): any {
    this.submitted = false;
    this.modalService.open(irrigationType, { size: "lg", centered: true });
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
    if (this.listJsForm.valid) {
      if (this.listJsForm.get("ids")?.value) {
        this.ListJsDatas = this.ListJsDatas.map((data: { id: any }) =>
          data.id === this.listJsForm.get("ids")?.value
            ? { ...data, ...this.listJsForm.value }
            : data
        );
      } else {
        this.listJsForm.controls["cropTypeId"].setValue(this.cropTypeId);
        // const masterCrop_name = this.listJsForm.get("masterCrop_name")?.value;
        // const description = this.listJsForm.get("description")?.value;
        let formData = this.listJsForm.value;
        console.log("formData", formData);
        // this.ListJsDatas.push({
        //   crop_name,
        //   description,
        // });
        this.modalService.dismissAll();
      }
    }
    this.modalService.dismissAll();
    setTimeout(() => {
      this.listJsForm.reset();
    }, 2000);
    this.submitted = true;
  }

  cropTypeAdd(data: any): void {
    this.cropTypeId=data.cropTypeId;
    this.listJsForm.controls["cropTypeId"].setValue(data?.cropTypeName);
    // this.modalService.dismissAll();
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
  deleteId: any;
  confirm(content: any, id: any) {
    this.deleteId = id;
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
  deleteData(id: any) {
    if (id) {
      document.getElementById("lj_" + id)?.remove();
    } else {
      this.checkedValGet.forEach((item: any) => {
        document.getElementById("lj_" + item)?.remove();
      });
    }
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
    var listData = this.ListJsDatas.filter(
      (data: { id: any }) => data.id === id
    );
    this.listJsForm.controls["cropTypeId"].setValue(listData[0]?.crop_name);
    this.listJsForm.controls["masterCrop_name"].setValue(
      listData[0]?.masterCrop_name
    );
    this.listJsForm.controls["description"].setValue(listData[0]?.description);
    this.listJsForm.controls["ids"].setValue(listData[0]?.id);
  }

  saveCrop(payload: any): void {
    this.service.cropTypeAdd().subscribe(
      (res: any) => {
        console.log("res", res);
        this.getMasterCropType();
      },
      (err) => {
        console.log("err", err);
      }
    );
  }

  UpdateCrop(payload: any): void {
    this.service.cropTypeUpdate().subscribe(
      (res: any) => {
        console.log("res", res);
        this.getMasterCropType();
      },
      (err) => {
        console.log("err", err);
      }
    );
  }
}
