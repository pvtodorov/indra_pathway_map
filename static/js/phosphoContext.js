function phosphoContext(cy, dataset, condition, style){
    var linear_scale = d3.scaleLinear()
    .domain([-1, 0, 1])
    .range(["blue", "white", "red"]);
    cond = dataset[condition]
    var genes = Object.keys(cond)
    for (g of genes){
      var members = cond[g]['members']
      var node = cy.$('node[name = ' +'"' + g + '"' + ']')
      var sites = members['sites']
      if (sites.length > 0){
          node.data('members', members['sites'])
          var values = members['values']
          var pie_sizes = new Array(16).fill(0);
          var pie_colors = new Array(16).fill(default_colors[5]);
          var current_slice = 0;
          for (var site in sites) {
            pie_sizes[current_slice] = (100*(1/sites.length));
            pie_colors[current_slice] = linear_scale(values[site])
            current_slice += 1;
          }
          node.data('pie_sizes', pie_sizes);
          node.data('pie_colors', pie_colors);
          node.addClass('hasMembers');
      }
      var abundance = cond[g]['node']
      var abundance_values = abundance['values']
      if (abundance_values.length > 0){
          var abundance_value = abundance_values[0]
          if (style === 'sizes'){
              var dim = 200
              var new_dim = dim*(Math.pow(2, abundance_value))
              node.style('height', new_dim)
              node.style('width', new_dim)
          }
          if (style === 'borders'){
              node.style('border-width', 30)
              node.style('border-style', 'double')
              node.style('border-color', linear_scale(abundance_value))
          }
      }
    }
}
