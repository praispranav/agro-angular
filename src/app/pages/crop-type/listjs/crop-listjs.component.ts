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
    // this.listJsForm = this.formBuilder.group({
    //   ids: [""],
    //   customer_name: ["", [Validators.required]],
    //   email: ["", [Validators.required]],
    //   phone: ["", [Validators.required]],
    //   date: ["", [Validators.required]],
    //   status: ["", [Validators.required]],
    // });

    /**
     * fetches data
     */
    // this.ListJsList.subscribe(x => {
    //   this.ListJsDatas = Object.assign([], x);
    // });

    this.service.getAll().subscribe(
      (res: any) => {
        //debugger;
        this.listItems = res.data ;
        console.log("res", res);
      },
      () => {}
    );
  }
 /**
   * Open modal
   * @param content modal content
   */
 openModal(content: any) {
  this.submitted = false;
  this.modalService.open(content, { size: 'md', centered: true });
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
    if (this.listJsForm.get('ids')?.value) {
      this.ListJsDatas = this.ListJsDatas.map((data: { id: any; }) => data.id === this.listJsForm.get('ids')?.value ? { ...data, ...this.listJsForm.value } : data)
    } else {
      const customer_name = this.listJsForm.get('customer_name')?.value;
      const email = this.listJsForm.get('email')?.value;
      const phone = this.listJsForm.get('phone')?.value;
      const date = '14 Apr, 2021';
      const status_color = "success";
      const status = this.listJsForm.get('status')?.value;
      this.ListJsDatas.push({
        customer_name,
        email,
        phone,
        date,
        status_color,
        status
      });
      this.modalService.dismissAll()
    }
  }
  this.modalService.dismissAll();
  setTimeout(() => {
    this.listJsForm.reset();
  }, 2000);
  this.submitted = true
}

// The master checkbox will check/ uncheck all items
checkUncheckAll(ev: any) {
  this.ListJsDatas.forEach((x: { state: any; }) => x.state = ev.target.checked)
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
  var checkboxes: any = document.getElementsByName('checkAll');
  var result
  var checkedVal: any[] = [];
  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      result = checkboxes[i].value;
      checkedVal.push(result);
    }
  }
  if (checkedVal.length > 0) {
    this.modalService.open(content, { centered: true });
  }
  else {
    Swal.fire({ text: 'Please select at least one checkbox', confirmButtonColor: '#299cdb', });
  }
  this.checkedValGet = checkedVal;

}

// Delete Data
deleteData(id: any) {
  if (id) {
    document.getElementById('lj_' + id)?.remove();
  }
  else {
    this.checkedValGet.forEach((item: any) => {
      document.getElementById('lj_' + item)?.remove();
    });
  }
}

/**
* Open modal
* @param content modal content
*/
editModal(content: any, id: any) {
  this.submitted = false;
  this.modalService.open(content, { size: 'md', centered: true });
  var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
  updateBtn.innerHTML = "Update";
  var listData = this.ListJsDatas.filter((data: { id: any; }) => data.id === id);
  this.listJsForm.controls['customer_name'].setValue(listData[0].customer_name);
  this.listJsForm.controls['email'].setValue(listData[0].email);
  this.listJsForm.controls['phone'].setValue(listData[0].phone);
  this.listJsForm.controls['date'].setValue(listData[0].date);
  this.listJsForm.controls['status'].setValue(listData[0].status);
  this.listJsForm.controls['ids'].setValue(listData[0].id);
}

  
}
