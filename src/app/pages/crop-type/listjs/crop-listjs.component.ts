import { Component, QueryList, ViewChildren } from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { Observable } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  UntypedFormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from "@angular/forms";

// Sweet Alert
import Swal from "sweetalert2";

import { CropListJsModel } from "./crop-listjs.model";
import { ListJs } from "./data";
import { CropService } from "./crop-listjs.service";
import { CropTypeInterface } from "./crop-type.interface";
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
  listJsForm!: FormGroup;
  ListJsData!: CropListJsModel[];
  checkedList: any;
  cropSelected!: boolean;
  ListJsDatas: any;
  masterSelected!: boolean;
  cropTypeData: any;
  payload!: CropTypeInterface;
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
    this.getCropType();
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
      crop_name: ["", [Validators.required]],
      description: ["", [Validators.required]],
    });

    /**
     * fetches data
     */
    this.ListJsList.subscribe((x) => {
      this.ListJsDatas = Object.assign([], x);
    });
  }

  getCropType(): void {
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
      // if (this.listJsForm.get("ids")?.value) {
      //   this.ListJsDatas = this.ListJsDatas.map((data: { id: any }) =>
      //     data.id === this.listJsForm.get("ids")?.value
      //       ? { ...data, ...this.listJsForm.value }
      //       : data
      //   );
      // }
    } else {
      // const crop_name = this.listJsForm.get("crop_name")?.value;
      // const description = this.listJsForm.get("description")?.value;
      // this.ListJsDatas.push({
      //   crop_name,
      //   description,
      // });
      let formData = this.listJsForm.value;
      this.payload = {
        CropTypeName: formData.crop_name,
        Description: formData.description,
      };
      console.log("payload", this.payload);
      if (this.cropTypeData?.cropTypeId) {
        this.payload.cropTypeId = this.cropTypeData?.cropTypeId;
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

  resetForm(): void {
    this.listJsForm.reset();
  }

  // Delete Data
  deleteData(id: any) {
    let payload = {
      cropTypeId: this.deleteId,
    };
    this.deleteCrop(payload);
    // if (id) {
    //   document.getElementById("lj_" + id)?.remove();

    // } else {
    //   this.checkedValGet.forEach((item: any) => {
    //     document.getElementById("lj_" + item)?.remove();
    //   });
    // }
  }

  /**
   * Open modal
   * @param content modal content
   */
  editModal(content: any, id: any) {
    this.submitted = false;
    this.listItems.forEach((element) => {
      if (id === element.cropTypeId) {
        this.cropTypeData = element;
      }
    });
    console.log("cropTypeData", this.cropTypeData);
    this.listJsForm.patchValue({
      crop_name: this.cropTypeData?.cropTypeName
        ? this.cropTypeData?.cropTypeName
        : "",
      description: this.cropTypeData?.description
        ? this.cropTypeData?.description
        : "",
    });

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
    // var listData = this.ListJsDatas.filter(
    //   (data: { id: any }) => data.id === id
    // );
    // console.log("listData", listData);

    // this.listJsForm.controls["crop_name"].setValue(listData[0]?.crop_name);
    // this.listJsForm.controls["description"].setValue(listData[0]?.description);
    // this.listJsForm.controls["ids"].setValue(listData[0]?.id);
  }

  saveCrop(payload: any): void {
    this.service.cropTypeAdd(payload).subscribe(
      (res: any) => {
        console.log("res", res);
        this.modalService.dismissAll();
        this.getCropType();
      },
      (err) => {
        console.log("err", err);
      }
    );
  }

  UpdateCrop(payload: any): void {
    this.service.cropTypeUpdate(payload).subscribe(
      (res: any) => {
        console.log("res", res);
        this.modalService.dismissAll();
        this.getCropType();
      },
      (err) => {
        console.log("err", err);
      }
    );
  }

  deleteCrop(payload: any): void {
    this.service.cropTypeDelete(payload).subscribe(
      (res: any) => {
        console.log("res", res);
        this.getCropType();
      },
      (err) => {
        console.log("err", err);
      }
    );
  }
}
