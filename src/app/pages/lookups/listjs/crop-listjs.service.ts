/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";


@Injectable({ providedIn: "root" })
export class CropService {

  constructor(private http: HttpClient) 
  {}

  masterCropList() {
    let headers = new HttpHeaders();
    headers = headers.set(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );
    return this.http.get(
      `https://dev.endpoint.smartagrofarm.my/api/Lookup/LookUpMasterCrop?SearchCropType=null`,
      { headers: headers }
    );
  }

  cropTypeList() {
    let headers = new HttpHeaders();
    headers = headers.set(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );
    return this.http.get(
      `https://dev.endpoint.smartagrofarm.my/api/Lookup/LookUpCropType`,
      { headers: headers }
    );
  }

  irrigationList() {
    let headers = new HttpHeaders();
    headers = headers.set(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );
    return this.http.get(
      `https://dev.endpoint.smartagrofarm.my/api/Lookup/LookUpIrrigationType`,
      { headers: headers }
    );
  }

  yieldTypeList() {
    let headers = new HttpHeaders();
    headers = headers.set(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );
    return this.http.get(
      `https://dev.endpoint.smartagrofarm.my/api/Lookup/LookUpYieldType`,
      { headers: headers }
    );
  }

  varietyTypeList() {
    let headers = new HttpHeaders();
    headers = headers.set(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );
    return this.http.get(
      `https://dev.endpoint.smartagrofarm.my/api/Lookup/LookUpVarietyType`,
      { headers: headers }
    );
  }

  soilTypeList(){
    let headers = new HttpHeaders();
    headers = headers.set(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );
    return this.http.get(
      `https://dev.endpoint.smartagrofarm.my/api/Lookup/LookUpSoilType`,
      { headers: headers }
    );
  }
}
