/* global mapboxgl: true */

import $ from 'jquery';
import applyLabels from '../js/apply-labels';
import censusBlocks from '../data/blocks-103-105';
import como from '../data/como';
import diff358 from '../data/diff-358';
import labels from '../data/labels';
import plan283 from '../data/plan283';
import plan358 from '../data/plan358';
import slides from '../js/slides';
import './all283map';
import './furniture';

$(document).ready(() => {

  let map;

  // some constants that control the paint values of our layers
  const SHAPEFILL = 0.45;
  const LINEFILL = 1;
  const LINEWIDTH = [[8, 3], [11, 2], [12, 1.5]];
  const PLURALITYSTOPS = [['anglo', '#e34e36'], ['black', '#ddca86'],['hispanic', '#329ce8'],];

  function resetMap() {

    // set the original 283 shapes to visible
    map.setLayoutProperty('283Borders', 'visibility', 'visible');
    map.setLayoutProperty('283Shapes', 'visibility', 'visible');

    // resets the 283 layers to original paint properties
    map.setPaintProperty('283Shapes', 'fill-opacity', SHAPEFILL);
    map.setPaintProperty('283Borders', 'line-opacity', LINEFILL);

    // hides the 358 and como layers
    map.setLayoutProperty('358Borders', 'visibility', 'none');
    map.setLayoutProperty('358Shapes', 'visibility', 'none');
    map.setLayoutProperty('comoBorders', 'visibility', 'none');
    map.setLayoutProperty('comoShapes', 'visibility', 'none');

    // resets the map to the original origin and zoom level
    map.fitBounds([
      [-97.57955467040368, 32.63321026198933],
      [-96.7878523998954, 33.00022101569766],
    ]);

    // reactivates all the labels
    $('.map__label').removeClass('inactive');
  }

  function updateMap(slide) {
    const thisSlide = slides[slide];
    // fit the map into the given slides bounds
    map.fitBounds(thisSlide.bounds, {
      linear: true,
      padding: 10,
    });

    $('#map__year').text(thisSlide.year);
    // fade back the unneeded labels
    $('.map__label').addClass('inactive');
    $('.custom-label').addClass('no-show');

    const stops = [];
    thisSlide.shapes.forEach((shape) => {
      $(`#label-${shape}`).removeClass('inactive');
      const thisStop = [shape, 0.45];
      stops.push(thisStop);
    });

    if (thisSlide.customLabels.length > 0) {
      thisSlide.customLabels.forEach((label) => {
        $(`#label-${label}`).removeClass('inactive').removeClass('no-show');
      });
    }

    thisSlide.activeLayers.forEach((layer) => {
      map.setLayoutProperty(`${layer}Borders`, 'visibility', 'visible');
      map.setLayoutProperty(`${layer}Shapes`, 'visibility', 'visible');

      if (layer !== 'como') {
        map.setPaintProperty(`${layer}Shapes`, 'fill-opacity', {
          property: 'District',
          type: 'categorical',
          stops,
          default: 0.15,
        });

        map.setPaintProperty(`${layer}Borders`, 'line-opacity', 1);
      }

      if (layer === 'censusBlocks') {
        map.setPaintProperty(`${layer}Shapes`, 'fill-opacity', 1);
        map.setPaintProperty(`${layer}Borders`, 'line-opacity', 1);
      }

      if (layer === 'diff358') {
        map.setPaintProperty(`${layer}Shapes`, 'fill-opacity', 0.85);
        map.setPaintProperty(`${layer}Borders`, 'line-opacity', 0.85);
      }
    });

    thisSlide.inactiveLayers.forEach((layer) => {
      map.setLayoutProperty(`${layer}Borders`, 'visibility', 'none');
      map.setLayoutProperty(`${layer}Shapes`, 'visibility', 'none');
    });
  }

  /*
  ==============================================================================
  DISPLAY POINTS ON CLICK (COMMENT THIS OUT FOR PRODUCTION)
  ==============================================================================
  */


  // function displayPoints(e) {
  //   console.log(JSON.stringify(e.lngLat));
  //       // e.lngLat is the longitude, latitude geographical position of the event
  // }

  /*
  ==============================================================================
  INITIAL DRAW OF THE MAP
  ==============================================================================
  */

  function drawMap() {
    map.fitBounds([
      [-97.57955467040368, 32.63321026198933],
      [-96.7878523998954, 33.00022101569766],
    ]);
    // adding plan 283 fills to the map
    map.addSource('plan283', {
      type: 'geojson',
      data: plan283,
    });

    map.addLayer({
      id: '283Shapes',
      source: 'plan283',
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
        'fill-opacity': SHAPEFILL,
      },
    });

    // adding plan 283 lines to the map
    map.addLayer({
      id: '283Borders',
      source: 'plan283',
      type: 'line',
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
        visibility: 'visible',
      },
      paint: {
        'line-color': '#3d3d3d',
        'line-width': {
          stops: LINEWIDTH,
        },
        'line-opacity': LINEFILL,
      },
    });

    // adding plan 358 fills to the map
    map.addSource('plan358', {
      type: 'geojson',
      data: plan358,
    });

    map.addLayer({
      id: '358Shapes',
      source: 'plan358',
      type: 'fill',
      layout: {
        visibility: 'none',
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
        'fill-opacity': SHAPEFILL,
      },
    });

    // adding plan 358 lines to the map
    map.addLayer({
      id: '358Borders',
      source: 'plan358',
      type: 'line',
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
        visibility: 'none',
      },
      paint: {
        'line-color': '#3d3d3d',
        'line-width': {
          stops: LINEWIDTH,
        },
        'line-opacity': LINEFILL,
      },
    });

    // adding como neighborhood
    map.addSource('como', {
      type: 'geojson',
      data: como,
    });

    map.addLayer({
      id: 'comoShapes',
      source: 'como',
      type: 'fill',
      layout: {
        visibility: 'none',
      },
      paint: {
        'fill-color': '#ff8f24',
        'fill-opacity': 0.7,
      },
    });

    map.addLayer({
      id: 'comoBorders',
      source: 'como',
      type: 'line',
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
        visibility: 'none',
      },
      paint: {
        'line-color': '#3d3d3d',
        'line-width': {
          stops: LINEWIDTH,
        },
        'line-opacity': LINEFILL,
      },
    });

    // adding 358 differences from 2011 to 2013
    map.addSource('diff358', {
      type: 'geojson',
      data: diff358,
    });

    map.addLayer({
      id: 'diff358Shapes',
      source: 'diff358',
      type: 'fill',
      layout: {
        visibility: 'none',
      },
      paint: {
        'fill-color': {
          type: 'categorical',
          property: 'movement',
          stops: [
            ['in', '#105c93'],
            ['out', '#ffffff'],
          ],
        },
        'fill-opacity': 0.85,
      },
    });

    map.addLayer({
      id: 'diff358Borders',
      source: 'diff358',
      type: 'line',
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
        visibility: 'none',
      },
      paint: {
        'line-color': '#3d3d3d',
        'line-width': {
          stops: [[8, 4], [11, 3], [12, 2.5]],
        },
        'line-opacity': 1,
      },
    });

    // adding oddities neighborhood
    map.addSource('censusBlocks', {
      type: 'geojson',
      data: censusBlocks,
    });

    map.addLayer({
      id: 'censusBlocksShapes',
      source: 'censusBlocks',
      type: 'fill',
      layout: {
        visibility: 'none',
      },
      paint: {
        'fill-color': {
          property: 'plurality',
          type: 'categorical',
          stops: [
            ['anglo', '#e34e36'],
            ['black', '#ddca86'],
            ['hispanic', '#329ce8'],
            ['none', '#ffffff'],
          ],
          default: '#ffffff',
        },
        'fill-opacity': 1,
      },
    });

    map.addLayer({
      id: 'censusBlocksBorders',
      source: 'censusBlocks',
      type: 'line',
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
        visibility: 'none',
      },
      paint: {
        'line-color': '#3d3d3d',
        'line-width': 1,
        'line-opacity': 1,
      },
    });

    // applying the labels for the various districts
    labels.forEach((element) => {
      applyLabels(element, map);
    });


    // display points of click on map
    // COMMENT OUT FOR PRODUCTION
    // map.on('click', (e) => {
    //   displayPoints(e);
    // });
  }

  /*
  ==============================================================================
  INITIAL MAP SETUP
  ==============================================================================
  */

  map = new mapboxgl.Map({
    container: 'map',
    style: 'https://maps.dallasnews.com/styles.json',
    center: [-97.08208, 32.8371],
    zoom: 10,
    sprite: '../data/sprite',
  });

  // disable the scroll wheel zoom
  map.scrollZoom.disable();
  map.dragPan.disable();
  map.dragRotate.disable();
  map.touchZoomRotate.disable();

  // once the map's loaded, do the initial draw of other layers
  map.on('load', () => drawMap());


  /*
  ==============================================================================
  WINDOW SCROLLING FUNCTIONS
  ==============================================================================
  */



  const $mapGraphic = $('#map-container');
  let slideMarker = -1;
  let mapOrigState = true;

  $(window).scroll(() => {
    // setting window dimensions
    const scrollTop = $(window).scrollTop();
    const windowHeight = $(window).height();
    const windowMidpoint = scrollTop + (windowHeight / 2);

    // setting scroller and chart dimensions
    const scrollerHeight = $('#scroller').outerHeight();
    const scrollerTop = $('#scroller').offset().top;
    const chartHeight = $mapGraphic.outerHeight();

    // setting waypoints
    const lockStart = scrollerTop - 20;
    const lockEnd = scrollerTop + scrollerHeight;

    // if the scroll is past the top waypoint and hasn't yet reached the end waypoint
    // lock the court into view at the top
    if (scrollTop > lockStart && scrollTop + chartHeight < lockEnd) {
      $mapGraphic.addClass('locked');
      $mapGraphic.removeClass('locked-bottom');
    } else if (scrollTop + chartHeight > lockEnd) {
      // else, if the scroll is past the end waypoint, lock the court into
      // the bottom of the scroller, allowing it to scroll up with the page
      $mapGraphic.addClass('locked-bottom');
    } else {
      // if it doesn't fall into either of those conditions, i.e. the top of the
      // page, unlock the court
      $mapGraphic.removeClass('locked');
      $mapGraphic.removeClass('locked-bottom');
    }


    let currentSlide;
    let slideMilestone;

    $.each($('.scroller__slide'), function () {
      // for each slide, set variables for it's offset top and milestone id
      const slideContentTop = $(this).offset().top;

      // if this slide is above the bottom of the window  and has a defined data-slide attribute
      // update the slideMilestone variable with this slide's number
      if ($(this).attr('data-slide') !== undefined && slideContentTop < windowMidpoint) {
        slideMilestone = parseInt($(this).attr('data-slide'), 10);
        currentSlide = slideMilestone;

        // if the currentSlide differs from the current slideMarker, we know
        // we've changed to a new slide.
        if (currentSlide !== slideMarker) {
          updateMap(slideMilestone);
          // update the milestoneMarker with the current Milestone
          slideMarker = slideMilestone;
        }

        mapOrigState = false;
      }
    });

    if (scrollerTop > scrollTop && mapOrigState !== true) {
      resetMap();
      mapOrigState = true;
      slideMarker = -1;
    }
  });
});
