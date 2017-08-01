function phosphoContextSN(cy, dataset, condition){
    for (a of ['mousedown', 'mouseup', 'touchstart', 'touchend', 'layoutstop']){
     scapes['cy_1'].off(a)
    }
    var linear_scale = d3.scaleLinear()
    .domain([-1, 0, 1])
    .range(["blue", "white", "red"]);
    var nodes = [];
    // var site_edges = [];
    var abundances = {};
    var cond = dataset[condition]
    var genes = Object.keys(cond)
    for (g of genes){
      var members = cond[g]['members']
      var node = cy.$('node[name = ' +'"' + g + '"' + ']')
      if (node.length > 0){
         var c = cy.remove(node)
         var edges = c.edges()
         var parent_id = "p"+node.data('id')
         var abundance = cond[g]['node']
         var abundance_values = abundance['values']
         if (abundance_values.length > 0){
             var abundance_value = abundance_values[0]
             abundances[node.data('id')] = linear_scale(abundance_value)
         }
         var sites = members['sites']
         if (sites.length > 0){
             var values = members['values']
             for (var site in sites) {
               var node_site = {group: "nodes", data: {id: node.data('id')+'.'+site,
                                                       name: sites[site],
                                                       parent: parent_id},
                                                style: {'width':50,
                                                        'height':50,
                                                        'background-color':linear_scale(values[site]),
                                                        'z-index': 10}}
                // var edge_site = { group: "edges", data: { id: node.data('id')+'.'+site+'edge',
                //                                           source: node.data('id')+'.'+site,
                //                                           target: node.data('id'),
                //                                           type: 'Activation',
                //                                           weight: 50} }
                nodes.push(node_site)
                // site_edges.push(edge_site)
             }
         }

         nodes.push({group: "nodes", data: {id: parent_id},
                                            style: {'background-opacity':0,
                                                    'border-width': 1,
                                                    'z-index': 100
                                                    }
                    });
        nodes.push({group: "nodes", data: {id: parent_id+"_2", parent: parent_id},
                                           style: {'background-opacity':0,
                                                   'border-width': 1,
                                                   'z-index': 100
                                                   }
                   });

         var node_json = node.json()
         node_json['data']['parent'] = parent_id+"_2"
         nodes.push(node_json)
         cy.add(nodes)
         cy.add(edges)
        //  cy.add(site_edges)
         for (i in abundances){
             var node = cy.$('node[id = ' +'"' + i + '"' + ']')
             node.style('background-color', abundances[i])
         }
      }

    }
    var params = {
    	name: "cose-bilkent",
      //ready: function () {
      // Called on `layoutstop`
      stop: function () {
      },
      // number of ticks per frame; higher is faster but more jerky
      refresh: 30,
      // Whether to fit the network view after when done
      fit: true,
      // Padding on fit
      padding: 0,
      // Whether to enable incremental mode
      randomize: false,
      // Node repulsion (non overlapping) multiplier
      nodeRepulsion: 1,
      // Ideal edge (non nested) length
      idealEdgeLength: 100,
      // Divisor to compute edge forces
      edgeElasticity: 0.45,
      // Nesting factor (multiplier) to compute ideal edge length for nested edges
      nestingFactor: 1,
      // Gravity force (constant)
      gravity: 1,
      // Maximum number of iterations to perform
      numIter: 2500,
      // For enabling tiling
      tile: false,
      // Type of layout animation. The option set is {'during', 'end', false}
      animate: 'during',
      // Represents the amount of the vertical space to put between the zero degree members during the tiling operation(can also be a function)
      tilingPaddingVertical: 10,
      // Represents the amount of the horizontal space to put between the zero degree members during the tiling operation(can also be a function)
      tilingPaddingHorizontal: 1,
      // Gravity range (constant) for compounds
      gravityRangeCompound: 0.5,
      // Gravity force (constant) for compounds
      gravityCompound: 2,
      // Gravity range (constant)
      gravityRange: 1,
      // Initial cooling factor for incremental layout
      initialEnergyOnIncremental:0.9
    };
    var layout = cy.makeLayout( params );
    layout.run()
}
