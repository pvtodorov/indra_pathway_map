function phosphoContextSN(cy, dataset, condition){
    for (a of ['mousedown', 'mouseup', 'touchstart', 'touchend', 'layoutstop']){
     scapes['cy_1'].off(a)
    }
    var linear_scale = d3.scaleLinear()
    .domain([-1, 0, 1])
    .range(["blue", "white", "red"]);
    var nodes = [];
    var cmp_nodes = {};
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
         var parent_id = node.data('id') + '.p1'
         var parent_id2 = parent_id + '.p2'
         var abundance = cond[g]['node']
         var abundance_values = abundance['values']
         if (abundance_values.length > 0){
             var abundance_value = abundance_values[0]
             abundances[node.data('id')] = linear_scale(abundance_value)
         }
         cmp_nodes[node.data('id')] = [node.data('id')]
         var sites = members['sites']
         if (sites.length > 0){
             var values = members['values']
             for (var site in sites) {
               var node_site = {group: "nodes", data: {id: node.data('id')+'.'+site,
                                                       name: sites[site],
                                                       parent: parent_id,
                                                       uuid_list: node.data('uuid_list')},
                                                style: {'width':50,
                                                        'height':50,
                                                        'background-color':linear_scale(values[site]),
                                                        'z-index': 10,
                                                        'text-halign': 'right',
                                                        'text-valign': 'center',
                                                        'z-index': 10},
                                                position: {'x': node.position('x'),
                                                           'y': node.position('y')},
                                                grabbable: false}
                // var edge_site = { group: "edges", data: { id: node.data('id')+'.'+site+'edge',
                //                                           source: node.data('id')+'.'+site,
                //                                           target: node.data('id'),
                //                                           type: 'Activation',
                //                                           weight: 50} }
                nodes.push(node_site)
                cmp_nodes[node.data('id')].push(node_site['data']['id'])
                // site_edges.push(edge_site)
             }
         }

         nodes.push({group: "nodes", data: {id: parent_id,
                                            uuid_list: node.data('uuid_list')},
                                            style: {'background-opacity':0,
                                                    'border-width': 1,
                                                    'z-index': 100},
                                            position: {'x': node.position('x'),
                                                       'y': node.position('y')},
                                           grabbable: false
                    });
        cmp_nodes[node.data('id')].push(parent_id)
        nodes.push({group: "nodes", data: {id: parent_id2, parent: parent_id,
                                           uuid_list: node.data('uuid_list')},
                                           style: {'background-opacity':0,
                                                   'border-width': 1,
                                                   'z-index': 100},
                                           position: {'x': node.position('x'),
                                                      'y': node.position('y')},
                                           grabbable: false
                   });
        cmp_nodes[node.data('id')].push(parent_id2)

         var node_json = node.json()
         node_json['data']['parent'] = parent_id2
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
      ready: function() {},
      stop: function () {},
      // number of ticks per frame; higher is faster but more jerky
      refresh: 1000,
      // Whether to fit the network view after when done
      fit: false,
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
      numIter: 1000,
      // For enabling tiling
      tile: false,
      // Type of layout animation. The option set is {'during', 'end', false}
      animate: 'during',
      // Represents the amount of the vertical space to put between the zero degree members during the tiling operation(can also be a function)
      tilingPaddingVertical: 0,
      // Represents the amount of the horizontal space to put between the zero degree members during the tiling operation(can also be a function)
      tilingPaddingHorizontal: 0,
      // Gravity range (constant) for compounds
      gravityRangeCompound: 0.5,
      // Gravity force (constant) for compounds
      gravityCompound: 2,
      // Gravity range (constant)
      gravityRange: 1,
      // Initial cooling factor for incremental layout
      initialEnergyOnIncremental:0.9
    };


    for (n_id in cmp_nodes){
        var n_ids = cmp_nodes[n_id]
        var sub_selectors = [];
        for (n2 of n_ids){
            var selector_string_sub = 'node[id = ' +'"' + n2 + '"' + ']'
            sub_selectors.push(selector_string_sub)
        }
        var selector_string = sub_selectors.join(',')
        var sub_cy = cy.$(selector_string)
        console.log(sub_cy)
        var layout = sub_cy.makeLayout( params );
        layout.run()
    }


    var layoutTimer;
    cy.on(('layoutstop'),function(){
          clearTimeout(layoutTimer);
          layoutTimer = setTimeout(function() {
              console.log('this fires once!')
              for (n_id in cmp_nodes){
                  var n_ids = cmp_nodes[n_id].slice(1,cmp_nodes[n_id].length)
                  var sub_selectors = [];
                  for (n2 of n_ids){
                      var selector_string_sub = 'node[id = ' +'"' + n2 + '"' + ']'
                      sub_selectors.push(selector_string_sub)
                  }
                  var selector_string = sub_selectors.join(',')
                  var sub_cy = cy.$(selector_string)
                  var node_tag = "sub"+n_id
                  sub_cy.nodes().forEach(function(n){
                      n.addClass(node_tag)
                  })
              }
              cy.$('node[id !*= "."]').nodes().forEach(function(node){
                  var posx = node.position('x')
                  var posy = node.position('y')
                  var node_tag = ".sub"+node.data('id')
                  var associates = cy.$(node_tag)
                  associates.nodes().forEach(function(assc){
                      var posx_a = assc.position('x')
                      var posy_a = assc.position('y')
                      assc.data('pos_diff', {'dx': posx - posx_a,
                                             'dy': posy - posy_a})
                  })
              })
          }, 250);
    })


    cy.$('node[id !*= "."]').nodes().on("drag", function(evt){
        var node = evt.cyTarget
        var posx = node.position('x')
        var posy = node.position('y')
        var node_tag = ".sub"+node.data('id')
        var associates = cy.$(node_tag)
        associates.nodes().forEach(function(assc){
            assc.position('x', (posx - assc.data('pos_diff')['dx']))
            assc.position('y', (posy - assc.data('pos_diff')['dy']))
        })
    })

    // //
    // //
    // //
    // var params = {
    //   name: 'cola',
    //   animate: true,
    //   randomize: false,
    //   maxSimulationTime: 2000,
    //   fit: false,
    //   infinite: false,
    //   ungrabifyWhileSimulating: false,
    //   // layout event callbacks
    //   ready: function(){
    //     //cy.fit(30)
    //   }, // on layoutready
    //   stop: undefined, // on layoutstop
    // };
    // var layout = cy.makeLayout( params );
    // var dragged = false;
    // cy.on(('mousedown'),function(){
    //   //console.log( 'mousedown' );
    //   layout.stop();
    //   cy.nodes().on(('drag'), function(){
    //     dragged = true;
    //   })
    //   });
    // cy.on(('mouseup'),function(){
    //   //console.log( 'mouseup' );
    //   if (dragged === true){
    //     layout.run();
    //     dragged = false;
    //   }
    // });
    // cy.on(('touchstart'),function(){
    //   //console.log( 'mousedown' );
    //   layout.stop();
    //   cy.nodes().on(('drag'), function(){
    //     dragged = true;
    //   })
    //   });
    // cy.on(('touchend'),function(){
    //   //console.log( 'mouseup' );
    //   if (dragged === true){
    //     layout.run();
    //     dragged = false;
    //   }
    // });
    //
    // cy.on(('layoutstop'),function(){
    //   nds = (cy.json()).elements.nodes
    //   nds.forEach( function(n) {
    //     preset_pos[n.data.name] = n.position;
    //   })
    //   //cy.center();
    // });
}
