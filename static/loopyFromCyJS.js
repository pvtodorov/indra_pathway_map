function loopyFromCyJS(scape) {
  // find all nodes that are not groups
  var ungrouped_nodes = [];
  scapes[scape].nodes().forEach(function(n){
  	if (n.isParent() == false) {
  		ungrouped_nodes.push(n);
  	}
  })
  // find all edges that are not pointing to/from groups
  var ungrouped_edges = [];
  scapes[scape].edges().forEach(function(e){
    var data = e.data();
    var source = data['source'];
    var target = data['target'];
    var ungrouped_node_ids = ungrouped_nodes.map(function(n){return n.id()})
  	if ((ungrouped_node_ids.includes(source)) &&
        (ungrouped_node_ids.includes(target)) &&
        (data['polarity'] !== "none")) {
  		ungrouped_edges.push(e);
  	}
  })
  // make a nodes string
  var nodes_str = ungrouped_nodes.map(function(n){
    // 0 - id
		// 1 - x
		// 2 - y
		// 3 - init value
		// 4 - label
		// 5 - hue
		var x = Math.round(n.position()['x'])
    var y = Math.round(n.position()['y'])
		var loopy_node = [n.id(), x, y, 1, n.data()['name'].replace(' ','%2520'), 1]
    loopy_node = JSON.stringify(loopy_node)
    return loopy_node;
  });
  nodes_str = nodes_str.join();
  nodes_str = '[' + nodes_str + ']'

  var edges_str = ungrouped_edges.map(function(e){
    // 0 - from
		// 1 - to
		// 2 - arc
		// 3 - strength
		// 4 - rotation (optional)
		// var data = e.data();
    var data = e.data();
    var source = data['source'];
    var target = data['target'];
    var strength = 1;
    if (data['polarity'] !== 'positive') {
      strength = -1;
    }

    var loopy_edge = [source, target, 35, strength, 1]
    loopy_edge = JSON.stringify(loopy_edge)
    return loopy_edge;
  });
  edges_str = edges_str.join();
  edges_str = '[' + edges_str + ']'

  var loopy_model_str = '[' + [nodes_str, edges_str].join() + ',[],2%5D';
  return loopy_model_str
}
