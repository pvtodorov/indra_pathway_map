var colorbrewer = ['#fdbb84','#fee8c8','#e34a33', '#3182bd', '#000000']
//0-4 are greens, 5 is a grey
var node_scale = ['#edf8e9', '#bae4b3', '#74c476', '#31a354', '#006d2c', '#bdbdbd']



document.addEventListener("DOMContentLoaded", function() {


  var cy = cytoscape({
    container: document.getElementById('cy'),

    elements: modelElements,

    style: [
      {
        selector: 'node',
        style: {
          'label': 'data(name)',
          'width': '200px',
          'height': '200px',
          'background-color': function(node){ return node_scale[node.data('expression')]},
          //'background-color': node_scale[5],
          'background-opacity': 1,
          'font-size': '26px',
          'text-halign': 'above',
          'text-valign': 'center',

        }
      },

      {
        selector: ':parent',
        style: {
          'label': '',
          'background-color': colorbrewer[1],
          'background-opacity': 1
        }
      },


      {
        selector: 'edge',
        style: {
        'line-color': colorbrewer[4],
        'target-arrow-color': colorbrewer[4],
        //'width': function(edge){ return edge.data('weight')*6},
        'width':6,
        'target-arrow-shape': 'triangle',
        'control-point-step-size': '140px'
        },

      },

      {
        selector: '.complex',
        style: {
        'line-color': colorbrewer[3],
        'target-arrow-color': colorbrewer[3],
        'source-arrow-color': colorbrewer[3],
        //'width': '6px',
        'target-arrow-shape': 'circle',
        'source-arrow-shape': 'circle',
        'control-point-step-size': '140px'
      }},

      {  selector: '.negative',
        style: {
        'line-color': colorbrewer[2],
        'target-arrow-color': colorbrewer[2],
        'source-arrow-color': colorbrewer[2],
        //'width': '6px',
        'target-arrow-shape': 'tee',
        'source-arrow-shape': 'none',
        'control-point-step-size': '140px'
        }}



    ],

    layout: {
      name: 'dagre',
      directed: 'true',
      fit: 'true',
      rankDir: 'TB',
      //rankSep: 15,
      //padding: 10,
      edgeWeight: function( edge ){ return edge.data('weight'); }
    },

    // layout: {
    //   name: 'cose-bilkent',
    //   gravity: 0.3,
    //   gravityCompound: 0.6,
    //   idealEdgeLength: 1600,
    //   nodeRepulsion: 2000,
    //   edgeElasticity: 0.6,
    //   numIter: 20000,
    // }


  });


cy.edges().forEach(function(e){
  if (e.data('i') === 'Complex'){
    e.addClass('complex');
    console.log(e.data('i'));
  };
});

cy.edges().forEach(function(e){
  if (e.data('polarity') === 'negative'){
    e.addClass('negative');
    console.log(e.data('polarity'));
  };
});

cy.edges().forEach(function(e){
  if (e.data('i') === 'Virtual'){
    e.remove();
    console.log(e.data('i'));
  };
});


cy.nodes().forEach(function(n){

  if (n.isParent() == false){
    var g = n.data('name');


    n.qtip({
      content: [
        {
          name: 'GeneCard',
          url: 'http://www.genecards.org/cgi-bin/carddisp.pl?gene=' + g
        },
        {
          name: 'UniProt',
          url: 'http://www.uniprot.org/uniprot/?query='+ g +'&fil=organism%3A%22Homo+sapiens+%28Human%29+%5B9606%5D%22&sort=score'
        }
      ].map(function( link ){
        return '<a target="_blank" href="' + link.url + '">' + link.name + '</a>';
      }).join('<br />\n'),
      position: {
        my: 'top center',
        at: 'bottom center'
      },
      style: {
        classes: 'qtip-light',
        tip: {
          width: 16,
          height: 16
        }
      }
    });
  };






});





cy.edges().forEach(function(e){
  var g = e.data('weight');

  e.qtip({
    content: [
      {
        name: g,
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




});
