/*
****************************************************************************
APPLYING CUSTOM LABELS AND MARKERS TO THE MAP
****************************************************************************
*/

export default function (element, map) {
  console.log(element);
  // create an html element for each element passed into the fucntion
  const el = document.createElement(element.el);

  // give that element the appropriate class types
  el.className = `marker ${element.class}`;
  el.id = element.id;

  // create a text node based on the content of the element passed and append
  // it to the created element
  const text = document.createTextNode(element.content);
  el.appendChild(text);

  // add that element to the map at the coordinates specified on the element object
  new mapboxgl.Marker(el)
    .setLngLat(element.coord)
    .addTo(map);
}
