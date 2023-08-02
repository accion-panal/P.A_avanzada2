import { getProperties} from "../services/PropertiesServices.js";

import { PropertyData } from "../Data/userId.js";


export default async function apiCallMap() {
    
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2VyZ2lvdmVyYWhlcm5hbmRlemJpZGF0YSIsImEiOiJjbDMwZHc4cmswMDdqM2NydmIzYWF0cGl4In0.hsYQFPebleAB4j6mRckMzQ'
    const map = new mapboxgl.Map({

        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-70.680628,-33.469970],
        zoom:8,

    });


   const {CodigoUsuarioMaestro,companyId,realtorId} = PropertyData;


    let response = await getProperties(1, 10,CodigoUsuarioMaestro, 1, companyId, realtorId);
    let data = response.data;
    // document.getElementById("total-prop").innerHTML = `<span>${response.meta.totalItems} Propiedades encontradas</span>`;
    const promiseMap = new Promise(
        (resolve)=>{
        data.map(data => {

                if(data.LngLat === null )return;

                const LngLat= data.LngLat.replace('{','').replace('}','').replace(',', '').replace('Lat', "").split(':');


                const propiedad = [parseFloat(LngLat[1]) , parseFloat(LngLat[2])];

                // create the popup
                const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
                <span>${data.title}</span>
                <br>
                <a href="/property-single.html?${data.id}&realtorId=${realtorId}&statusId=${1}&companyId=${companyId}" name="VerDetalle"  class="more d-flex align-items-center float-start">
                <span class="label" id="getProperty">Ver detalle</span>
                <span class="arrow"><span class="icon-keyboard_arrow_right"></span></span>
                </a>`)

                // create DOM element for the marker
                const el = document.createElement('div');
                el.id = 'marker';


                new mapboxgl.Marker({
                    color: '#00000',
                    scale: .8
                })
                    .setLngLat(propiedad)
                    .setPopup(popup) // sets a popup on this marker
                    .addTo(map);
            })
            resolve()
        }
    )
    promiseMap.then(()=>{

        map.on('load', function () {
            map.resize();
        });
        map.on('style.load', () => {
            map.setFog({}); // Set the default atmosphere style

        });
    })


}


