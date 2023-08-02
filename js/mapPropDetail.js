import apiCallMapDetail from "./propiedad/apiMapDetalle.js";
import { PropertyData } from "./Data/userId.js";

const url = window.location.search; 
const value = url.match(/\d+/)[0];

const {companyId} = PropertyData;


apiCallMapDetail(value, 1, companyId);