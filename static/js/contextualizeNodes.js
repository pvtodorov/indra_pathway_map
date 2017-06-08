function contextualizeNodes(cy){
    cy.startBatch()
    var cell_line = $('#cellSelectDynamic').val().substring(6, $('#cellSelectDynamic').val().length-5)
    var ctxt_exp = ctxt['CCLE']['bin_expression'][bins][cell_line]
    var ctxt_mut = ctxt['CCLE']['mutation'][cell_line]
    cy.nodes().forEach(function(n){
        var data = n.data()
        // if the node has members, build pie chart background arrays, qtips
        if (data.hasOwnProperty("members")){
          members = data.members;
          var fam_length = Object.keys(members).length
            if (fam_length > 0){
              var pie_sizes = new Array(16).fill(0);
              var pie_colors = new Array(16).fill(default_colors[5]);
              var current_slice = 0;
              for (var gene in members) {
                var ctxt_bin = ctxt_exp[gene]
                pie_sizes[current_slice] = (100*(1/fam_length));
                // if a gene exists in the context object, set its color
                // if a gene does not exist in context, it is already grey
                // as per the array conditions above
                if (ctxt_bin !== null){
                    if (((ctxt_mut[gene]) !== 1) && ((ctxt_exp[gene]) !== undefined)){
                      pie_colors[current_slice] = exp_colorscale[bins][(ctxt_exp[gene])]
                    }
                    if (((ctxt_mut[gene]) === 1) && ((ctxt_exp[gene]) !== undefined)){
                      pie_colors[current_slice] = mut_colorscale[bins][(ctxt_exp[gene])]
                    }
                }

                current_slice += 1;
              }
            n.data('pie_sizes', pie_sizes);
            n.data('pie_colors', pie_colors);

            n.addClass('hasMembers');

            }
        }// member check


        // call out to qtip api if node is not parent
        if (n.isParent() == false){
            var gene = n.data().name
            var ctxt_bin = ctxt_exp[gene]
            if (ctxt_bin !== null){
                var bkg_col = default_colors[5]
                if (((ctxt_mut[gene]) !== 1) && ((ctxt_exp[gene]) !== undefined)){
                   bkg_col = exp_colorscale[bins][(ctxt_exp[gene])]
                }
                if (((ctxt_mut[gene]) === 1) && ((ctxt_exp[gene]) !== undefined)){
                  bkg_col = mut_colorscale[bins][(ctxt_exp[gene])]
                }
                n.style({'background-color' : bkg_col})
            }
        }; // check if n.isParent()

      });
  cy.endBatch()
}
