import { getPropertiesForId } from "../services/PropertiesServices.js";
// import { clpToUf } from "../utils/getExchangeRate.js";

import ExchangeRateServices from "../services/ExchangeRateServices.js";

import { parseToCLPCurrency, clpToUf } from "../utils/getExchangeRate.js"

export default async function apiDetalleCall(id, realtorId, statusId, companyId) {
	let { data } = await getPropertiesForId(id,realtorId,  statusId, companyId);

	const response = await ExchangeRateServices.getExchangeRateUF();
	const ufValue = response?.UFs[0]?.Valor
	const ufValueAsNumber = parseFloat(ufValue.replace(',', '.'));
    const ufValueAsNumber2 = parseInt(ufValue.replace('.', '').replace(',', '.'));



	let imagenes = "";
	let imgcaroucel = "";



	// CAROUCEL
	data.images.forEach((images, index) => {
		imagenes +=
		`<div class="carousel-item ${index === 0 ? "active" : ""}" style="padding-top: 8px">
		<img src="${images.replace(/\\/g, "//") != undefined ? images.replace(/\\/g, "//") : 'Ir a'}" class="img img-carroucel"/>
	</div>`

	});

	document.getElementById('carousel-img-prop').innerHTML = `
				<div id="carouselExampleControlsNoTouching" class="carousel slide" data-bs-touch="false" data-bs-interval="false">
				<div class="carousel-inner">
				 	${imagenes}
				</div>
				<button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControlsNoTouching" data-bs-slide="prev">
				<span class="carousel-control-prev-icon" aria-hidden="true"></span>
				<span class="visually-hidden">Previous</span>
				</button>
				<button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControlsNoTouching" data-bs-slide="next">
					<span class="carousel-control-next-icon" aria-hidden="true"></span>
					<span class="visually-hidden">Next</span>
				</button>
				</div>`;
	//FIN CAROUCEL

	document.getElementById('format-carousel-prop').innerHTML = `
						<div class="col-6  p-3 " style="border-right: 1px #ffb649 solid;">						
									<a type="button" class="" data-bs-toggle="modal"
										data-bs-target="#modalImgCarrousel">
										IMÁGENES
									</a>			
						</div>
						<div class="col-6  p-3">
									<a href="">VISTA 360°</a>		
						</div>`;

	// CAROUCEL MODAL

	data.images.forEach((images, index) => {
		imgcaroucel +=
		`<div class="carousel-item ${index === 0 ? "active" : ""}">
			<img src="${images.replace(/\\/g, "//") != undefined ? images.replace(/\\/g, "//") : 'Ir a'}" class="img-carroucel-modal" />
		</div>`
	})
	// FIN CAROUCEL MODAL



	document.getElementById('modal-carroucel-img').innerHTML = `
											<div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel" data-bs-touch="true">							
												<div class="carousel-inner">
													${imgcaroucel}
												</div>
												<button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
												  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
												  <span class="visually-hidden">Previous</span>
												</button>
												<button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
												  <span class="carousel-control-next-icon" aria-hidden="true"></span>
												  <span class="visually-hidden">Next</span>
												</button>
											</div>`;



document.getElementById('title-cod-ubi-prop').innerHTML = `
<h1 class="heading " style="font-weight: bold; color: #4D4D4D;">${data.title != undefined && data.title != null ? data.title : "No cuenta con titulo"}</h1>

<p>
    <i class="fa fa-map-marker "  aria-hidden="true"></i>
    ${data.city != undefined && data.city != "" && data.city != null ? data.city : "No registra ciudad"}, ${data.commune != undefined && data.commune != "" && data.commune != null ? data.commune : "No registra comuna"}, Chile
</p>`;


if(data.currency.isoCode != 'CLP'){
	document.getElementById('price-uf-opera-prop').innerHTML = `
	<div class="row">
		<div class="col-lg-12 col-sm-12" style="display: flex;justify-content: right;">
			<b>							
				<h1 class="heading " style="font-weight: bold; color: #55555b;">UF ${data.price}</h1>
			</b>
		</div>
		<div class="col-lg-12 col-sm-12" style="display: flex;justify-content: right;">
			<h4 class="heading" style="color:#ffb649;">CLP ${parseToCLPCurrency(data.price * ufValueAsNumber2)}</h4>
		</div>
	</div>`;
}else {
	document.getElementById('price-uf-opera-prop').innerHTML = `
                    <div class="row">
						<div class="col-lg-12 col-sm-12" style="display: flex;justify-content: right;">
							<b>							
								<h1 class="heading " style="font-weight: bold; color: #55555b;">UF ${clpToUf(data.price, ufValueAsNumber)}</h1>
							</b>
						</div>
						<div class="col-lg-12 col-sm-12" style="display: flex;justify-content: right;">
							<h4 class="heading" style="color:#ffb649;">CLP ${parseToCLPCurrency(data?.price)}</h4>
						</div>
					</div>`;
}



	document.getElementById('title-descrip').innerHTML = `
						<div class="col-lg-4" style="padding-left: 110px;">
							<h2 class="font-weight-bold  heading">DESCRIPCIÓN</h2> 
						</div>
						<div class="col-lg-8 ">
							<hr width="90%" style="color:#ffb649" size="5" ></hr>
						</div>`;

	document.getElementById('description-prop').innerHTML = `
<p>${data.description != undefined && data.description != "" && data.description != null ? data.description : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi laudantium reprehenderit aspernatur.  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla magnam, modi aperiam temporibus eius architecto? Repudiandae earum quis non quod neque vel odio minus cumque, unde ut! Iste, beatae nemo.Vitae neque, ullam dolore possimus exercitationem corrupti corporis beatae, enim illo voluptas expedita rem porro totam fugit perferendis."}</p>
<h5>Caracteristicas generales</h5>
<ul class="list-caract-gral">
	<li>
		<span><b>Tipo operación: </b></span><span>${data.operation}</span>
	</li>
	<li>	
		<span><b>Tipo propiedad: </b></span><span>${data.types}</span>
	</li>
	<li>	
		<span><b>Código de propiedad: </b></span><span>${data.id}</span>
	</li>
</ul>
`;

	document.getElementById('caract-prop').innerHTML = `
				<ul class="list-caract-prop">
					<li style="font-size: 30px;">
						<i class="fa fa-bed"  aria-hidden="true"></i>
						<span>${data.bedrooms || "0"}</span>
					</li>
					<li style="font-size: 30px;">		
						<i class="fa fa-bath  "  aria-hidden="true"></i>
						<span>${data?.bathrooms || "0"}</span>
					</li>
					<li style="font-size: 30px;">	
						<i class="fa fa-car"  aria-hidden="true"></i>
						<span>${data?.coveredParkingLots || "0"}</span>			
					</li>
					<li style="font-size: 30px;">
							<i class="fa fa-ruler  "  aria-hidden="true"></i>					
							<span>${data?.surface_m2 || "0"}</span>		
						</div>				
					</li>
				</ul>`;

	document.getElementById('title-map').innerHTML = `
		<div class="col-lg-4" style="padding-left: 150px;">
			<h2 class="font-weight-bold  heading">MAPA</h2> 
		</div>
		<div class="col-lg-8 ">
			<hr width="90%" style="color:#ffb649" size="5"  ></hr>
		</div>`;

	document.getElementById('realtor-data').innerHTML = `
		<div class="col-lg-12 col-sm-12" style="padding-top: 2%;">
			<p style="font-size: 22px;"><b>${data?.realtor.name || "No se encuentra nombre de corredor"} ${data?.realtor.lastName || ""}</b></p>
		</div>
		<div class="col-12">
			<p style="font-size: 16px ;font-weight: bold;">
			<i class="fa fa-envelope-open "aria-hidden="true"></i>
			${data?.realtor.mail || "No se encuentra email del corredor"}
		</p>
		</div>

		<div class="col-12">
			<p style="font-size: 16px; font-weight: bold;">
				<i class="fa fa-whatsapp" aria-hidden="true"></i>
				${data?.realtor.contactPhone != null && data.realtor.contactPhone != undefined ? data.realtor.contactPhone : "No se encuentra nombre de corredor"}
			</p>
		</div>
`

}

