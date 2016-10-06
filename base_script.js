var colorbrewer = ['#fdbb84','#fee8c8','#e34a33']

document.addEventListener("DOMContentLoaded", function() {

  var cy = cytoscape({
    container: document.getElementById('cy'),

    elements: rasPathwayElements,

    style: [
      {
        selector: 'node',
        style: {
          'label': 'data(molecule)',
          'width': '200px',
          'height': '200px',
          'background-color': colorbrewer[0],
          'background-opacity': 1,
          'font-size': '26px',
          'text-halign': 'above',
          'text-valign': 'center',

        }
      },

      {
        selector: ':parent',
        style: {
          'background-color': colorbrewer[1],
          'background-opacity': 0.8
        }
      },


      {
        selector: 'edge',
        style: {
        'line-color': colorbrewer[2],
        'target-arrow-color': colorbrewer[2],
        'width': '6px',
        'target-arrow-shape': 'triangle',
        'control-point-step-size': '140px'
        },

      }
    ],

    layout: {
      name: 'dagre',
      directed: 'true',
      fit: 'true'
      }

  });




  //cy.remove('#n0');

  cy.$('#n1').qtip({
  content: 'Hello!',
  position: {
    my: 'top center',
    at: 'bottom center'
  },
  style: {
    classes: 'qtip-bootstrap',
    tip: {
      width: 16,
      height: 8
    }
  }
});



cy.nodes().forEach(function(n){
  var g = n.data('molecule');
  console.log(n.data('molecule'));




  n.qtip({
    content: [
      {
        name: 'GeneCard',
        url: 'http://www.genecards.org/cgi-bin/carddisp.pl?gene=' + g
      },
      {
        name: 'UniProt search',
        url: 'http://www.uniprot.org/uniprot/?query='+ g +'&fil=organism%3A%22Homo+sapiens+%28Human%29+%5B9606%5D%22&sort=score'
      },
      {
        name: 'GeneMANIA',
        url: 'http://genemania.org/search/human/' + g
      }
    ].map(function( link ){
      return '<a target="_blank" href="' + link.url + '">' + link.name + '</a>';
    }).join('<br />\n'),
    position: {
      my: 'top center',
      at: 'bottom center'
    },
    style: {
      classes: 'qtip-bootstrap',
      tip: {
        width: 16,
        height: 8
      }
    }
  });



});




cy.edges().forEach(function(e){
  var g = e.data('evidence');

  e.qtip({
    content: [
      {
        name: 'Evidence',
        url:  g
      }
    ].map(function( link ){
      return '<a target="_blank" href="' + link.url + '">' + link.name + '</a>';
    }).join('<br />\n'),
    position: {
      my: 'top center',
      at: 'bottom center'
    },
    style: {
      classes: 'qtip-bootstrap',
      tip: {
        width: 16,
        height: 8
      }
    }
  });
});



// cy.on('tap', 'node', { foo: 'bar' }, function(evt){
//
//     var n = evt.cyTarget;
//     var g = n.data('molecule');
//
//     n.qtip({
//       content: [
//         {
//           name: 'GeneCard',
//           url: 'http://www.genecards.org/cgi-bin/carddisp.pl?gene=' + g
//         },
//         {
//           name: 'UniProt search',
//           url: 'http://www.uniprot.org/uniprot/?query='+ g +'&fil=organism%3A%22Homo+sapiens+%28Human%29+%5B9606%5D%22&sort=score'
//         },
//         {
//           name: 'GeneMANIA',
//           url: 'http://genemania.org/search/human/' + g
//         }
//       ].map(function( link ){
//         return '<a target="_blank" href="' + link.url + '">' + link.name + '</a>';
//       }).join('<br />\n'),
//       position: {
//         my: 'top center',
//         at: 'bottom center'
//       },
//       style: {
//         classes: 'qtip-bootstrap',
//         tip: {
//           width: 16,
//           height: 8
//         }
//       }
//     });
//
// });
//
});
