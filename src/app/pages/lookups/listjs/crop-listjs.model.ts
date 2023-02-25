export interface CropListJsModel {
  id: any;
  customer_name: string;
  email: string;
  phone: string;
  date: string;
  status: string;
  status_color: string;
  isSelected?:any;
}
export class MasterCrop {
  cropTypeId?: number;
  cropTypeDescription?: string;
  cropTypeName?: string;
 
}
