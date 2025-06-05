
initMap();

async function initMap() {
    await ymaps3.ready;

    
    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker, GeoPoint} = ymaps3;

    const mapEl = document.querySelector('.js-ymap')

    const map = new YMap(
      mapEl,
        {
            location: {
                center: [mapEl.dataset.longitude, mapEl.dataset.latitude],
                zoom: 18
            },
        },
        [
          new YMapDefaultFeaturesLayer({})
        ]
    );

    const url = mapEl.dataset.action;

    fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((result) => {
        const layer = new YMapDefaultSchemeLayer({
            customization: result
        });
        map.addChild(layer);
    });

    var marker
    if(mapEl.dataset.iconSrc) {

      let markerElementTextWrapper = document.createElement('div')
      let markerElementTitle = document.createElement('h2')

      markerElementTitle.innerHTML = "Видное"
      markerElementTitle.classList.add('marker-label-title')

      let markerElementText = document.createElement('div')

      markerElementText.classList.add('marker-label-text')
      markerElementTextWrapper.classList.add('marker-label-wrapper')

      markerElementText.innerHTML = "ул. Совхозная д.6"

      var markerElement = document.createElement('img')
      if(isMobile()) {
        markerElement.src = mapEl.dataset.iconSrcMobile
      }
      else {
        markerElement.src = mapEl.dataset.iconSrc
      }
      markerElement.className = 'icon-marker'

      markerElementTextWrapper.appendChild(markerElementTitle)
      markerElementTextWrapper.appendChild(markerElement)
      markerElementTextWrapper.appendChild(markerElementText)

      marker = new YMapMarker(
        {
          coordinates: [mapEl.dataset.markerLongitude, mapEl.dataset.markerLatitude], 
        },
        markerElementTextWrapper)
    }
    else {
      const {YMapDefaultMarker} = await ymaps3.import('@yandex/ymaps3-markers@0.0.1')
      marker = new YMapDefaultMarker(
        {
          coordinates: [mapEl.dataset.markerLongitude, mapEl.dataset.markerLatitude], 
        }
      )
    }
    

    map.addChild(marker)
    
    map.setBehaviors(['drag', 'dblClick'])
    mapEl.addEventListener('click', () => {
        map.setBehaviors(['drag', 'scrollZoom', 'dblClick'])
    }, {once: true})

    const mapContactsPage = document.querySelector('.js-ymap-contacts')

    if(mapContactsPage) {

      var markerContact
      if(mapContactsPage.dataset.iconSrc) {

        var markerElementContact = document.createElement('img')
        markerElementContact.src = mapEl.dataset.iconSrc
        markerElementContact.className = 'icon-marker'



        markerContact = new YMapMarker(
          {
            coordinates: [mapContactsPage.dataset.markerLongitude, mapContactsPage.dataset.markerLatitude], 
          },
          markerElementContact)
      }
      else {
        const {YMapDefaultMarker} = await ymaps3.import('@yandex/ymaps3-markers@0.0.1')
        markerContact = new YMapDefaultMarker(
          {
            coordinates: [mapContactsPage.dataset.markerLongitude, mapContactsPage.dataset.markerLatitude], 
          }
        )
      }

      markerElementContact = document.querySelector('.marker-icon-contact')

      const mapContacts = new YMap(
        mapContactsPage,
          {
              location: {
                  center: [mapContactsPage.dataset.longitude, mapContactsPage.dataset.latitude],
                  zoom: 18
              },
              
          },
          
          [
            new YMapDefaultFeaturesLayer({})
          ]
      );
      mapContacts.addChild(markerContact)

      mapContacts.addChild(new YMapDefaultSchemeLayer());
      mapContacts.setBehaviors(['drag', 'dblClick'])
      mapContactsPage.addEventListener('click', () => {
        mapContacts.setBehaviors(['drag', 'scrollZoom', 'dblClick'])
      }, {once: true})
    }

}