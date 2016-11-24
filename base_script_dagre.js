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
          'border-width': 7,
          'border-color': colorbrewer[4],
          'background-color':colorbrewer[4],
          'background-color': function(node){
            bin_expression = 5;
            if (node.data('bin_expression') === parseInt(node.data('bin_expression'), 10)){
              bin_expression = node.data('bin_expression');
            };
            return node_scale[bin_expression]},
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
        'width':13,
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
      }},

        {  selector: '.Attractor',
        style: {
          'display': 'none',
          'z-index': 0

        }},

        // {  selector: '.nAttractor',
        // style: {
        //   'label': null,
        //   'width': '1px',
        //   'height': '1px',
        //   'padding-left': '1px',
        //   'padding-right': '1px',
        //   'display': 'none',
        //   'z-index': 0
        //
        // }},

        {  selector: '.hasMembers',
        style: {
          'width': '200px',
          'height': '200px',
          'content': 'data(name)',
          'pie-size': '100%',
          'border-width': 7,
          'border-color': colorbrewer[4],
          'background-color':colorbrewer[4],
          'pie-1-background-size':function(node){
            return node.data().pie_sizes[0]},
          'pie-2-background-size':function(node){
            return node.data().pie_sizes[1]},
          'pie-3-background-size':function(node){
            return node.data().pie_sizes[2]},
          'pie-4-background-size':function(node){
            return node.data().pie_sizes[3]},
          'pie-5-background-size':function(node){
            return node.data().pie_sizes[4]},
          'pie-6-background-size':function(node){
            return node.data().pie_sizes[5]},
          'pie-7-background-size':function(node){
            return node.data().pie_sizes[6]},
          'pie-8-background-size':function(node){
            return node.data().pie_sizes[7]},
          'pie-9-background-size':function(node){
            return node.data().pie_sizes[8]},
          'pie-10-background-size':function(node){
            return node.data().pie_sizes[9]},
          'pie-11-background-size':function(node){
            return node.data().pie_sizes[10]},
          'pie-12-background-size':function(node){
            return node.data().pie_sizes[11]},
          'pie-13-background-size':function(node){
            return node.data().pie_sizes[12]},
          'pie-14-background-size':function(node){
            return node.data().pie_sizes[13]},
          'pie-15-background-size':function(node){
            return node.data().pie_sizes[14]},
          'pie-16-background-size':function(node){
            return node.data().pie_sizes[15]},
          // slice colors according to expression bin
          'pie-1-background-color': function(node){
            return node_scale[node.data().pie_colors[0]]},
          'pie-2-background-color': function(node){
            return node_scale[node.data().pie_colors[1]]},
          'pie-3-background-color': function(node){
            return node_scale[node.data().pie_colors[2]]},
          'pie-4-background-color': function(node){
            return node_scale[node.data().pie_colors[3]]},
          'pie-5-background-color': function(node){
            return node_scale[node.data().pie_colors[4]]},
          'pie-6-background-color': function(node){
            return node_scale[node.data().pie_colors[5]]},
          'pie-7-background-color': function(node){
            return node_scale[node.data().pie_colors[6]]},
          'pie-8-background-color': function(node){
            return node_scale[node.data().pie_colors[7]]},
          'pie-9-background-color': function(node){
            return node_scale[node.data().pie_colors[8]]},
          'pie-10-background-color': function(node){
            return node_scale[node.data().pie_colors[9]]},
          'pie-11-background-color': function(node){
            return node_scale[node.data().pie_colors[10]]},
          'pie-12-background-color': function(node){
            return node_scale[node.data().pie_colors[11]]},
          'pie-13-background-color': function(node){
            return node_scale[node.data().pie_colors[12]]},
          'pie-14-background-color': function(node){
            return node_scale[node.data().pie_colors[13]]},
          'pie-15-background-color': function(node){
            return node_scale[node.data().pie_colors[14]]},
          'pie-16-background-color': function(node){
            return node_scale[node.data().pie_colors[15]]},
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
  if (e.data('i') === 'Attractor'){
    e.addClass('Attractor');
    console.log(e.data('Attractor'));
  };
});

// cy.nodes().forEach(function(n){
//   if (n.data('name') === 'Attractor'){
//     n.addClass('nAttractor');
//     console.log(n.data('nAttractor'));
//   };
// });

cy.nodes().forEach(function(n){
  data = n.data()
  if (data.hasOwnProperty("members")){
    members = data.members;
    if (members.hasOwnProperty("HGNC")){
      HGNC = members.HGNC;
      if (Object.keys(HGNC).length > 0){
        fam_length = Object.keys(HGNC).length
        var pie_sizes = new Array(16).fill(0);
        var pie_colors = new Array(16).fill(5);
        var pie_mutations = new Array(16).fill(0);
        current_slice = 0;
        for (var gene in HGNC) {
          pie_sizes[current_slice] = (100*(1/fam_length));
          pie_colors[current_slice] = (HGNC[gene].bin_expression);
          pie_mutations[current_slice] = (HGNC[gene].mutation);
          console.log(HGNC[gene].mutation);
          current_slice += 1;
      }
      n.data('pie_sizes', pie_sizes);
      n.data('pie_colors', pie_colors);
      n.data('pie_mutations', pie_mutations);
      n.addClass('hasMembers');
      console.log(n);

    }
  }
}

});

cy.nodes().forEach(function(n){
  if (n.hasClass('hasMembers')){
    console.log(n.data());
  };
});

// cy.edges().forEach(function(e){
//   if (e.data('i') === 'Attractor'){
//     e.remove();
//     console.log(e.data('i'));
//   };
// });


// cy.nodes().forEach(function(n){
//   if (n.data('name') === 'Attractor'){
//     n.remove();
//     cy.forceRender();
//     console.log(n.data('name'));
//   };
// });


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
