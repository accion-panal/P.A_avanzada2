import { getPropertiesOnForm } from "../services/PropertiesServices.js"
// import { getProperties } from "../services/PropertiesServices.js";
import	ExchangeRateServices from  "../services/ExchangeRateServices.js";

import {parseToCLPCurrency, clpToUf} from "./getExchangeRate.js";


const onFormSubmit = (
    page,
    limit,
    realtorId,
    statusId,
    companyId,
    operationType,
    typeOfProperty,
    region,
    commune,
    min_price,
    max_price,
    bathrooms,
    bedrooms,
    covered_parking_lots
  ) => {
    return getPropertiesOnForm(
      page,
      limit,
      realtorId,
      statusId,
      companyId,
      operationType,
      typeOfProperty,
      region,
      commune,
      min_price,
      max_price,
      bathrooms,
      bedrooms,
      covered_parking_lots
    );
  };

  let query = {
    page:1,
    limit:10,
    realtorId: 0,
    statusId:1,
    companyId:1,
    operationType : "",
    typeOfProperty: "",
    region : "",
    commune: "",
    min_price: "",
    max_price: "",
    bathrooms: "",
    bedrooms: "",
    covered_parking_lots: "",
  }

  // let aux = new URLSearchParams(window.location.search);

  // for (let p of aux) {
  //   query[`${p[0]}`] = p[1];
  // }




document.getElementById('operationType').addEventListener('change',(element) =>{
    console.log(element.target.value)
    query.operationType = element.target.value;

 })
 document.getElementById('typeOfProperty').addEventListener('change' ,(element) => {
    query.typeOfProperty =  element.target.value;
})
document.getElementById("region").addEventListener( "change", (element) => {
 query.region = element.target.value;
 console.log(element.target.value)
})
document.getElementById("commune").addEventListener( "change", (element) => {
    query.commune =  element.target.value;
    console.log(element.target.value)


  })

 document.getElementById("min_price").addEventListener( "change", (element) => {
     query.min_price = element.target.value;
})

 document.getElementById("max_price").addEventListener( "change", (element) => {
    query.max_price= element.target.value;
})

 document.getElementById("bathrooms").addEventListener( "change", (element) => {
    query.bathrooms= element.target.value;
})
document.getElementById("bedrooms").addEventListener( "change", (element) => {
     query.bedrooms =  element.target.value;

  })

document.getElementById("covered_parking_lots").addEventListener( "change", (element) => {
    query.covered_parking_lots = element.target.value;
})




 document.getElementById('buscar2')?.addEventListener('click', async() => {
  console.log('buscando');
  
	window.location.origin +
		`/properties-map.html?page=${query.page}&limit=${query.limit}&realtorId=${query.realtorId}&statusId=${query.statusId}&operationType=${query.operationType}&typeOfProperty=${query.typeOfProperty}&region=${query.region}&commune=${query.commune}&min_price=${query.min_price}&max_price=${query.max_price}&covered_parking_lots=${query.covered_parking_lots}&bathrooms=${query.bathrooms}&bedrooms=${query.bedrooms}`

  document.getElementById(
		"buscar2"
	).innerHTML = ` <div class="spinner-border" role="status">
		<span class="visually-hidden">Loading...</span>
	</div>`;

  let filtred = await onFormSubmit(
    1,
    1,
    query?.operationType,
    query?.typeOfProperty,
    query?.region,
    query?.commune,
    query?.min_price,
    query?.max_price,
    query?.bathrooms,
    query?.bedrooms,
    query?.covered_parking_lots
    )


  const response2= await ExchangeRateServices.getExchangeRateUF();
  const ufValue = response2?.UFs[0]?.Valor


  const ufValueAsNumber = parseFloat(ufValue.replace(',', '.'));
  console.log(filtred);
	document.getElementById("total-prop").innerHTML = `${filtred.meta.totalItems} Propiedades encontradas
	</div>`;
	setTimeout(() => {
		document.getElementById("buscar2").innerHTML = `Buscar`;
		window.scroll({
			top: 500,
			behavior: "smooth",
		});

  document.getElementById('container-map-prop').innerHTML = filtred.data.map((data) => `
    <li class="splide__slide">
      <div class="col-xs-12 col-md-6 col-lg-12 col-sm-12 carta-grilla">
        <div class="property-item text-center">
            <a href="/property-single.html?${data.id}&statusId=${1}&companyId=${1}"" class="img">
                <img src="images/img_1.jpg.png" alt="Image" class="img-fluid">
            </a>
            <div class="property-content border">
                <p style="margin-bottom: 0;"> <i class="fa fa-map-marker fa-lg"></i> ${data.city != undefined && data.city != "" && data.city != null ? data.city : "No registra ciudad" }, ${data.commune != undefined && data.commune != "" && data.commune != null ? data.commune : "No registra comuna"}, Chile</p>
                <span class="city d-block mb-3 texto-titulo" style="font-weight: bold;font-size: 25px;">${data.title}</span>
                <p style="font-size: 20px;">REF: ${data.id}</p>

                <div class="" style="border-top: 2px solid #ffb649;">
                    <div class="row p-3 ">
                        <div class="col-5 hr-l">
                            <div class="row ">
                                <div class="col-12">Dormitorios</div>
                                <div class="col-12">${data.bedrooms != undefined && data.bedrooms != null && data.bedrooms != "" ? data.bedrooms : "0" }</div>
                            </div>
                        </div>
                        <div class="col-3 hr-l">
                            <div class="row ">
                                <div class="col-12">UF</div>
                                <div class="col-12">${clpToUf(data.price, ufValueAsNumber)}</div>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="row">
                                <div class="col-12">Baños</div>
                                <div class="col-12">${data.bathrooms != undefined && data.bathrooms != null && data.bathrooms != "" ? data.bathrooms : "0" }</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </li>
    `).join('');

    let splide = new Splide(".splide", {
      // type    : 'loop',
      perPage : 3,
      autoplay: 'play',
      // autoWidth: true,
      drag:true,    
  });
  splide.mount();

	}, 3000);

  })

  document.addEventListener("DOMContentLoaded", function () {
    let splide = new Splide(".splide");
    splide.mount();
  });
  
