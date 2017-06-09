var path_uuids = ['8cf69fb9-8475-4ea6-bca4-3ed4fd713201',
                    '4ab30852-d3eb-403e-85b1-7266941f9942',
                    '0d7b3d34-1e5f-457b-80bd-1418940ed30c',
                    'dfc1e04a-89df-41d6-aa9b-417c28422f4d',
                    '7f35615f-6e2d-4cd0-9bf9-aab42e238bf9',
                    'f603a54b-128d-413e-99f8-db2227a0498b',
                    '1353cd36-5984-43b4-9662-77f70ee3043e',
                    '9accb0b2-146a-4bb0-b42e-0bffb5a8cf97',
                    '0032751c-bbc8-47c5-b386-ad54a60722a1'
                    ]

function highlightPath(cy, uuids){
    cy.startBatch()
    var cell_line = $('#cellSelectDynamic').val().substring(6, $('#cellSelectDynamic').val().length-5)
    var ctxt_exp = ctxt['CCLE']['bin_expression'][bins][cell_line]
    var ctxt_mut = ctxt['CCLE']['mutation'][cell_line]
    cy.nodes().forEach(function(n){
        var highlighted = true
        var data = n.data()
        // highlight all non-parent nodes that match uuids
        //if (n.isParent() == false){
            var uuid_list = n.data().uuid_list
            for (u of uuid_list){
              if (path_uuids.indexOf(u) !== -1){
                highlighted = false
                break;
              }
            }
            if (highlighted === true){
              n.addClass('highlighted')
            }
          //}// check if n.isParent()
      })
      // highlight all non-virtual edges that match uuids
      cy.edges().forEach(function(e){
          var highlighted = true
          var data = e.data()
          // highlight all non-parent nodes that match uuids
          if (e.hasClass('virtual') === false){
              var uuid_list = e.data().uuid_list
              for (u of uuid_list){
                if (path_uuids.indexOf(u) !== -1){
                  highlighted = false
                  break;
                }
              }
              if (highlighted === true){
                e.addClass('highlighted')
              }
            }// check if n.isParent()
        })
  cy.endBatch()
}
