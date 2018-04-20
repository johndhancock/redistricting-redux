import $ from 'jquery';
import polylabel from 'polylabel';
import plan283All from '../data/plan283-all';


$(document).ready(() => {
  let map283;

  function createPopupContent(feature) {

  // checking if we're dealing with a geojson object based on a feature interaction
  // on the map. if we are, drill down to just that feature's properties
    if (feature.properties) {
      feature = feature.properties;
    }

    let popupContent = `<h5>District ${feature.District}</h5>`;
    popupContent += '<table>';
    popupContent += `<tr><td>Anglo: </td><td><span class="popup__bar" style="width: ${feature.anglo}%;"></span> ${feature.anglo}%</td></tr>`;
    popupContent += `<tr><td>Black: </td><td><span class="popup__bar" style="width: ${feature.black}%;"></span> ${feature.black}%</td></tr>`;
    popupContent += `<tr><td>Hispanic: </td><td><span class="popup__bar" style="width: ${feature.hispanic}%;"></span> ${feature.hispanic}%</td></tr>`;
    popupContent += `<tr><td>Other: </td><td><span class="popup__bar" style="width: ${feature.other}%;"></span> ${feature.other}%</td></tr>`;
    popupContent += '</table>';
    return popupContent;
  }

  /*
  ================================================================================
  DISPLAY MAP TOOLTIP

  Displays tooltip on the map when a feature is clicked on.
  ================================================================================
  */

  function displayPopup(event) {
    // collect all the features at the point of the event
    const features = map283.queryRenderedFeatures(event.point, {});

    // if there are no features at that point, return out of the function
    if (features.length === 0 || features[0].properties.plurality === undefined) { return; }

    const labelPoint = polylabel(features[0].geometry.coordinates, 1.0);

    // else, set feature to the first feature in the list of features
    const feature = features[0];

    // construct a new mapbox popup, set it's long/lat position to the long/lat
    // of the feature and set it's html to the result of the createPopupContent function
    const popup = new mapboxgl.Popup()
      .setLngLat(labelPoint)
      .setHTML(createPopupContent(feature));

    // add the popup to the map
    popup.addTo(map283);

    // animate the map to the coordinates of the feature
    map283.flyTo({
      center: labelPoint,
    });
  }


  /*
  ================================================================================
  CONTROL MAP CURSOR

  Changes cursor appearance based on if cursor is hovered over map or map feature
  ================================================================================
  */

  function updateMapCursor(event) {
    // find all features at the point of the event
    const features = map283.queryRenderedFeatures(event.point, {});
    // if the first feature in the list of features as an address propoerty, set the
    // cursor to a pointer
    map283.getCanvas().style.cursor = (features.length && features[0].properties.plurality !== undefined) ? 'pointer' : '';
  }

  function draw283Map() {
    // adding plan 283 fills to the map
    map283.addSource('plan283All', {
      type: 'geojson',
      data: plan283All,
    });

    map283.addLayer({
      id: 'dalCoHDs',
      source: 'plan283All',
      type: 'fill',
      layout: {
        visibility: 'visible',
      },
      paint: {
        'fill-color': {
          property: 'plurality',
          type: 'categorical',
          stops: [
            ['anglo', '#e34e36'],
            ['black', '#ddca86'],
            ['hispanic', '#329ce8'],
          ],
        },
        'fill-opacity': 0.45,
      },
    });

    // adding plan 283 lines to the map
    map283.addLayer({
      id: 'dalCoHDBorders',
      source: 'plan283All',
      type: 'line',
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
        visibility: 'visible',
      },
      paint: {
        'line-color': '#3d3d3d',
        'line-width': 2,
        'line-opacity': 1,
      },
    });

    map283.fitBounds([[-97.05265, 32.53882], [-96.489731, 32.99731]]);

    // update the cursor based on if user is hovering over point on a map
    map283.on('mousemove', (event) => {
      updateMapCursor(event);
    });

    // add click event to display popups when feature is clicked
    map283.on('click', event => displayPopup(event));
  }

  /*
  ==============================================================================
  DISPLAY POINTS ON CLICK (COMMENT THIS OUT FOR PRODUCTION)
  ==============================================================================
  */


  map283 = new mapboxgl.Map({
    container: 'all-283-map',
    style: 'https://maps.dallasnews.com/styles.json',
    zoom: 12,
    center: [-96.7950456421846, 32.78134385048314],
  });


  // disable the scroll wheel zoom
  map283.scrollZoom.disable();

  // add navigation controls
  map283.addControl(new mapboxgl.NavigationControl());

  // once the map's loaded, do the initial draw of other layers
  map283.on('load', () => draw283Map());
});
