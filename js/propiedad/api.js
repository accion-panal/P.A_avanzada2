import { getProperties} from "../services/PropertiesServices.js"

import	ExchangeRateServices from  "../services/ExchangeRateServices.js";

import {parseToCLPCurrency, clpToUf} from "../utils/getExchangeRate.js";

// import { getProps } from "../utils/pagPropiedad.js";

export default async function apiCall() {

const response = await getProperties(0, 1, 1);
const data = response.data;

const response2 = await ExchangeRateServices.getExchangeRateUF();
const ufValue = response2?.UFs[0]?.Valor
const ufValueAsNumber = parseFloat(ufValue.replace(',', '.'));


const filtroSelect = document.getElementById('FilterPrice');
filtroSelect.addEventListener('change', handleFilterChange);
showItems();

function handleFilterChange() {
  const selectedValue = filtroSelect.value;
  console.log(selectedValue);
  console.log(data);

  let dataOrdenada;

  if (selectedValue === 'MayorMenor') {
    /* console.log('La opción seleccionada es MayorMenor'); */
    dataOrdenada = data.sort((a, b) => b.price - a.price);
  } else {
    /* console.log('La opción seleccionada es Menor mayor'); */
    dataOrdenada = data.sort((a, b) => a.price - b.price);
  }
  console.log(dataOrdenada);
  showItems();
}


function showItems() {
document.getElementById("total-prop").innerHTML = `<span>${response.meta.totalItems} Propiedades encontradas
	</span>`;
  // let filtrado = data.filter(data => data.city != null && data.commune != null);
  document.getElementById('container-prop-card').innerHTML = data.map(data => 
    `<div class="col-xs-12 col-md-6 col-lg-4 col-sm-12 carta-grilla">
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
</div>`
    ).join('');   
   

    }
}
