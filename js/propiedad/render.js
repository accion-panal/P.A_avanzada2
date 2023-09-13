import { getProperties } from "../services/PropertiesServices.js";
import ExchangeRateServices from "../services/ExchangeRateServices.js";
import { parseToCLPCurrency, clpToUf } from "../utils/getExchangeRate.js";
import { PropertyData, limitDataApi } from "../Data/userId.js";
import paginationCall from "../utils/pagination.js";
import apiCallMap from "../propiedad/apiMapProp.js";


export default async function renderCall(){

      //* INICIALIZACION DE VARIABLES
      const { CodigoUsuarioMaestro, companyId, realtorId } = PropertyData;
      let response; 
      //* Rescatar datos del globalResponse
      //! si hay informacion, entra al if, de lo contrario al else
      let storedGlobalResponse = localStorage.getItem('globalResponse');
      if (storedGlobalResponse) {
          response = JSON.parse(storedGlobalResponse);
          let maxPage =  Math.ceil(response.meta.totalItems / response.meta.limit);
          localStorage.setItem('LimitPages', JSON.stringify(maxPage));
          /* localStorage.setItem('countPage', JSON.stringify(1)); */
      }
      else {
          //* el segundo digito es el limit
          response = await getProperties(1, limitDataApi.limit, CodigoUsuarioMaestro, 1, companyId, realtorId);
          //* Guardar el response en el localStorage
          localStorage.setItem('globalResponse', JSON.stringify(response));
  
          let maxPage =  Math.ceil(response.meta.totalItems / response.meta.limit);
          localStorage.setItem('LimitPages', JSON.stringify(maxPage));
          localStorage.setItem('countPage', JSON.stringify(1));
          paginationCall();
      }
      //! console log para saber el contenido del response despues del if
      //* Guardamos el data del response en una variable data
      let data = response.data;
  
      //* Cositas para el uf
      const response2 = await ExchangeRateServices.getExchangeRateUF();
      const ufValue = response2?.UFs[0]?.Valor;
      const ufValueAsNumber = parseFloat(ufValue.replace(",", "."));
      const ufValueAsNumber2 = parseInt(ufValue.replace('.', '').replace(',', '.'));
  
  
      //todo: Filtros Extras
      const filtroSelect = document.getElementById('FilterPrice');
      filtroSelect.addEventListener('change', handleFilterChange);
      function handleFilterChange() {
          //* Se rescata el value del select
          const selectedValue = filtroSelect.value;
  
          if (selectedValue === 'MayorMenor') {
            //* la data ordenada se guarda en response.data
            //* y se actualiza el localStorage de globalResponse
            response.data = data.sort((a, b) => b.price - a.price);
            localStorage.setItem('globalResponse', JSON.stringify(response));
          } else {
            //* la data ordenada se guarda en response.data
            //* y se actualiza el localStorage de globalResponse
            response.data = data.sort((a, b) => a.price - b.price);
            localStorage.setItem('globalResponse', JSON.stringify(response));
          }
          //* Se llama al showItems para actualizar las cards
          showItems();
      }




//todo: Cantidad de limite en las propiedades
const filtroLimit = document.getElementById('FilterLimit');
if(filtroLimit !== null){
    filtroLimit.addEventListener('change', handleLimitChange);
async function handleLimitChange() {
    
    try {
        //* el segundo digito es el limit
        response = await getProperties(1, filtroLimit.value, CodigoUsuarioMaestro, 1, companyId, realtorId);

        //* setear variables
        let maxPage =  Math.ceil(response.meta.totalItems / response.meta.limit);
        //* Guardar vaariables en el localStorage
        localStorage.setItem('globalResponse', JSON.stringify(response));
        localStorage.setItem('LimitPages', JSON.stringify(maxPage));
        localStorage.setItem('countPage', JSON.stringify(1));
        localStorage.setItem('LimitProperties', filtroLimit.value);
        
        //* Actualizar variables
        data = response.data;
        //* llamar funciones para actualizar visualmente.
        data = data.map(item => {
            // Reemplazar "\\" por "//" en la propiedad "image"
            item.image = item.image.replace(/\\/g, "//");
            return item;
        });
        
        paginationCall();
        showItems();
    } catch (error) {
        console.error('Error in handleLimitChange:', error);
    }
    
}
}else {
}

  
      //todo: LLamamos a la funcion que muestra las cards
      showItems();
  
      //todo: innerHTML de las propiedades encontradas
      document.getElementById("total-prop").innerHTML = `<span>${response.meta.totalItems} Propiedades encontradas</span>`;
  
      //todo: creacion de la funcion ShowItems
      function showItems() {
        data = data.map(item => {
            // Reemplazar "\\" por "//" en la propiedad "image"
            item.image = item.image.replace(/\\/g, "//");
            return item;
          });
          //* si container-propiedad es distinto de Null, hara un innerHTML 
          //! esto es para evitar errores
          let containerGrid = document.getElementById('container-prop-card');
          if (containerGrid !== null) {
              document.getElementById('container-prop-card').innerHTML = data.map(data => 
                    `<div class="col-xs-12 col-md-6 col-lg-4 col-sm-12 carta-grilla">
                    <div class="property-item text-center">              
                        <a href="/property-single.html?${data.id}&realtorId=${realtorId}&statusId=${1}&companyId=${companyId}" class="img">   
                            ${data.image.endsWith('.jpg') ? `<img src=${data.image} alt="Image" class="img-fluid">`: data.image.endsWith('.png') ? `<img src=${data.image} alt="Image" class="img-fluid ">` : data.image.endsWith('.jpeg') ? `<img src=${data.image} alt="Image" class="img-fluid ">`: `<img src='https://res.cloudinary.com/dbrhjc4o5/image/upload/v1681933697/unne-media/errors/not-found-img_pp5xj7.jpg' alt="Image" class="img-fluid">`}
                        </a>              
                        <div class="property-content border">
                            <p style="margin-bottom: 0;"> <i class="fa fa-map-marker fa-lg"></i> ${data.city != undefined && data.city != "" && data.city != null ? data.city : "No registra ciudad" }, ${data.commune != undefined && data.commune != "" && data.commune != null ? data.commune : "No registra comuna"}, Chile</p>
                            <a href="/property-single.html?${data.id}&realtorId=${realtorId}&statusId=${1}&companyId=${companyId}">
                                <span class="city d-block mb-3 texto-titulo" style="font-weight: bold;font-size: 25px;">${data.title != undefined ? data.title : "No cuenta con titulo"}</span>
                            </a>
                            <p style="font-size: 18px;">REF: ${data.id}</p>          
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
                                         ${ data.currency.isoCode !='CLP' ?  `<div class="col-12">UF</div><div class="col-12">${data.price}</div>`:`<div class="col-12">CLP</div><div class="col-12">${parseToCLPCurrency(data.price * ufValueAsNumber2)}</div>`}
                                          
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
              `).join("");
          };
  
        
    let containerMap = document.getElementById('container-map-prop');
    if(containerMap!== null ){
      document.getElementById('container-map-prop').innerHTML = data.map(data => 
        `<li class="splide__slide">
        <div class="col-xs-12 col-md-6 col-lg-12 col-sm-12 carta-grilla">
        <div class="property-item text-center">
            <a href="/property-single.html?${data.id}&realtorId=${realtorId}&statusId=${1}&companyId=${companyId}" class="img">
            ${data.image.endsWith('.jpg') ? `<img src=${data.image} alt="Image" class="img-fluid">`: data.image.endsWith('.png') ? `<img src=${data.image} alt="Image" class="img-fluid ">` : data.image.endsWith('.jpeg') ? `<img src=${data.image} alt="Image" class="img-fluid ">`: `<img src='https://res.cloudinary.com/dbrhjc4o5/image/upload/v1681933697/unne-media/errors/not-found-img_pp5xj7.jpg' alt="Image" class="img-fluid">`}
            </a>
            <div class="property-content border">
                <p style="margin-bottom: 0;"> <i class="fa fa-map-marker fa-lg"></i> ${data.city != undefined && data.city != "" && data.city != null ? data.city : "No registra ciudad" }, ${data.commune != undefined && data.commune != "" && data.commune != null ? data.commune : "No registra comuna"}, Chile</p>
                <a href="/property-single.html?${data.id}&realtor=${realtorId}&statusId=${1}&companyId=${companyId}">
                    <span class="city d-block mb-3 texto-titulo" style="font-weight: bold;font-size: 25px;">${data.title != null && data.title != undefined ? data.title : "No cuenta con titulo"}</span>
                </a>
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
    </li>`).join('');
    
        let splide = new Splide(".splide", {
            lazyLoad: 'nearby',
            perPage : 3,
            autoplay: 'play',
            rewind : true,
            perMove: 1,
            drag:true,   
            breakpoints: {
                1200:{
                perPage:2
                },
                990:{
                perPage : 1,
                focus:'center'     
                },
            766:{
                perPage : 1
            } 
            }
        });
        splide.mount();
    }
    
};

}
    
document.addEventListener("DOMContentLoaded", function () {
    let splide = new Splide(".splide");
    splide.mount();
})