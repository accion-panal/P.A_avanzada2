import { getPropertiesForId } from "../services/PropertiesServices.js";
// import { clpToUf } from "../utils/getExchangeRate.js";

import	ExchangeRateServices from  "../services/ExchangeRateServices.js";

import {parseToCLPCurrency, clpToUf} from "../utils/getExchangeRate.js"

export default async function apiDetalleCall(id,statusId, companyId) {
let {data} = await getPropertiesForId(id, statusId, companyId);

const response = await ExchangeRateServices.getExchangeRateUF();
const ufValue = response?.UFs[0]?.Valor
const ufValueAsNumber = parseFloat(ufValue.replace(',', '.'));


let indicadores;
let imagenes;


document.getElementById('title-cod-ubi-prop').innerHTML = `
<h1 class="heading " style="font-weight: bold; color: #4D4D4D;">${data.title}</h1>
<p>REF:${data.id}</p>
<p>
    <i class="fa fa-map-marker "  aria-hidden="true"></i>
    ${data.city != undefined && data.city != "" && data.city != null ? data.city : "No registra ciudad" }, ${data.commune != undefined && data.commune != "" && data.commune != null ? data.commune : "No registra comuna"}, Chile
</p>`;

document.getElementById('price-uf-opera-prop').innerHTML = `
                    <div class="row">
						<div class="col-lg-12 col-sm-12" style="display: flex;justify-content: right;">
							<b>
								<h2 style="font-weight: bold; color: #55555b;">${data.operation}</h2>
								<h1 class="heading " style="font-weight: bold; color: #55555b;">UF ${clpToUf(data.price, ufValueAsNumber)}</h1>
							</b>
						</div>
						<div class="col-12" style="display: flex;justify-content: right;">
							<h4 class="heading" style="color:#ffb649;"> CLP   ${parseToCLPCurrency(data?.price)}</h4>
						</div>
					</div>`;

document.getElementById('description-prop').innerHTML = `
<p>${data.description != undefined && data.description != "" && data.description != null ? data.description : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi laudantium reprehenderit aspernatur.  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla magnam, modi aperiam temporibus eius architecto? Repudiandae earum quis non quod neque vel odio minus cumque, unde ut! Iste, beatae nemo.Vitae neque, ullam dolore possimus exercitationem corrupti corporis beatae, enim illo voluptas expedita rem porro totam fugit perferendis."}</p>
<h5>Caracteristicas generales</h5>
<p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
`;

document.getElementById('caract-prop').innerHTML =  `
<div class="row " style="height: 100%;">
								<div class="col-12">
									<div class="row " style="font-size: 40px;">
										<div class="col-6 text-end">
											<i class="fa fa-bed  "  aria-hidden="true"></i>
										</div>
										<div class="col-6 text-start">
											${data.bedrooms || "0"}
										</div>
									</div>
								</div>
								<div class="col-12">
									<div class="row " style="font-size: 40px;">
										<div class="col-6 text-end">
											<i class="fa fa-bath  "  aria-hidden="true"></i>
										</div>
										<div class="col-6">
                                        ${data?.bathrooms || "0"}
										</div>
									</div>
								</div>
								<div class="col-12">
									<div class="row " style="font-size: 40px;">
										<div class="col-6 text-end">
											<i class="fa fa-car  "  aria-hidden="true"></i>
										</div>
										<div class="col-6">
                                        ${data?.coveredParkingLots || "0"}
										</div>
									</div>
								</div>
								<div class="col-12">
									<div class="row " style="font-size: 40px;">
										<div class="col-6 text-end">
											<i class="fa fa-ruler  "  aria-hidden="true"></i>
										</div>
										<div class="col-6">
                                        ${data?.surface_m2 || "0"}
										</div>
									</div>
								</div>
							</div>`;

}

