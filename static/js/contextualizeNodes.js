function contextualizeNodes(cy){
    cy.nodes().forEach(function(n){
        var ctxt_exp = context['CCLE']['bin_expression'][bins][cell_line]
        var ctxt_mut = context['CCLE']['mutation'][cell_line]
        var data = n.data()
        // if the node has members, build pie chart background arrays, qtips
        if (data.hasOwnProperty("members")){
          members = data.members;
            if (Object.keys(members).length > 0){
              fam_length = Object.keys(members).length
              var pie_sizes = new Array(16).fill(0);
              var pie_colors = new Array(16).fill(default_colors[5]);
              var current_slice = 0;
              var content = []; // stores the
              for (var gene in members) {
                pie_sizes[current_slice] = (100*(1/fam_length));
                if ((ctxt_mut[gene]) === 0){
                  pie_colors[current_slice] = exp_colorscale[(ctxt_exp[gene])]
                }
                if ((ctxt_mut[gene]) !== 0){
                  pie_colors[current_slice] = mut_colorscale[(ctxt_exp[gene])]
                }
              //console.log(pie_colors);

                var db_links = [];
                for (var namespace in members[gene]['db_refs']){
                  if (namespace !== 'BE'){
                    db_links.push({
                      id: gene,
                      name: namespace,
                      url: members[gene]['db_refs'][namespace]
                    });
                  }
                } // for (var namespace ...)


                content.push(db_links);
                current_slice += 1;
            }
            n.data('pie_sizes', pie_sizes);
            n.data('pie_colors', pie_colors);

            var list_lines = content.map(function( link ){
            var line = '<b style="font-size:13px">' + String(link[0].id) + '</b>' + ' ' +
                       '<a  style="font-size:11px" target="_blank" href=https://www.citeab.com/search?q="' + link[0].id + '">' +  "CiteAb"  + '</a>&nbsp;' +
                       '<a  style="font-size:11px" target="_blank" href="' + link[0].url + '">' + link[0].name + '</a>&nbsp;' +
                       '<a style="font-size:11px" target="_blank" href="' + link[1].url + '">' + link[1].name  + '</a>';
            return line;
            });

            //console.log(list_lines);


            var content_str = list_lines.map(function( line ){
              return '<li>' + line + '</li>';
            }).join('');
            content_str = '<ul>' + content_str + '</ul>';

            qtip_api_call = {
              content: {
                title: '<b style="font-size:14px">' + n.data().name + '</b>',
                text: content_str
              },
              position: {
                my: 'top center',
                at: 'bottom center'
              },
              style: {
                classes: 'qtip-light',
                tip: {
                  width: 16,
                  height: 8
                }
              }
            }

            n.data('qtip', qtip_api_call)

            n.addClass('hasMembers');
            //console.log(n.data().qtip);

        }}// member check

        // call out to qtip api if node is not parent
        if (n.isParent() == false){

          if (n.data().qtip){
            tip = n.data().qtip;
            n.qtip(tip);
          }
          else {
            var content_text = [];
            content_text.push(
                {name : "CiteAb", url: "https://www.citeab.com/search?q=" + n.data().name});
            if (data.hasOwnProperty("db_refs")){
              db_refs = data.db_refs;
              for (var namespace in db_refs) {
                content_text.push(
                  {name : namespace, url: db_refs[namespace]});

              }

            }

            n.qtip({
              content: {title: '<b style="font-size:14px">' + n.data('name') + '</b>',
                text: content_text.map(function( link ){
                  return '<a target="_blank" href="' + link.url + '">' + link.name + '</a>';
                }).join('<br />')
            },

              position: {
                my: 'top center',
                at: 'bottom center'
              },
              style: {
                classes: 'qtip-light',
                tip: {
                  width: 16,
                  height: 8
                }
              }
            });// n.qtip
          }
        }; // check if n.isParent()

        // if a node is an attractor, tag it with nAttractor class
        if (n.data('name') === 'Attractor'){
          n.addClass('nAttractor');
        }; // if Attractor


      });

}
