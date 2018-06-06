var cy = cytoscape();

// {name : position} dict
var prebuilt_model = 'McCormick';
var preset_pos = {};
var preset_pos_static = {};

// {id : position} dict
var id_pos = {};

var scapes = {};
var stmts = {};

// var indra_server_addr = "http://indra-api-72031e2dfde08e09.elb.us-east-1.amazonaws.com:8000";
var indra_server_addr = "http://0.0.0.0:8080";

var ctxt = {};
grabJSON('static/models/Fallahi_mass_spec/fallahi_data.json').then(
  function(ajax_response){
    ctxt =  ajax_response;
  });

var korkut = {};
grabJSON('static/models/' + 'Korkut' + '/korkut.json').then(
  function(ajax_response){
    korkut =  ajax_response;
  });
var condition = 'AK|10';

var domain = [2.7, 3.7, 4.7, 5.7, 6.7, 7.7, 8.7, 9.7, 10.7];
var exp_colorscale = d3.scaleThreshold()
    .domain(domain)
    .range(['#f7fcf5','#e5f5e0','#c7e9c0','#a1d99b','#74c476','#41ab5d','#238b45','#006d2c','#00441b']);
var mut_colorscale =  d3.scaleThreshold()
    .domain(domain)
    .range(['#fff5eb','#fee6ce','#fdd0a2','#fdae6b','#fd8d3c','#f16913','#d94801','#a63603','#7f2704']);

var parser = 'reach';

var select_array;
var sub_select_array;
var unique_col_val;

var ctx_select_divs = ['#drug_select', '#conc_select', '#time_select', '#cell_line_select'];
var current_ctx_selection = new Array(ctx_select_divs.length).fill("");

var paths;
var table_data;
var path_uuids_dict = {};
var table;
var path_id;

grabJSON('static/models/' + 'Fallahi_mass_spec' + '/paths.json').then(
  function(ajax_response){
    paths =  ajax_response;
    var path_metas = [];
    for (var i=0; i<paths['Vemurafenib_1_1_MMACSF'].length; i++){
    	meta = paths['Vemurafenib_1_1_MMACSF'][i]["meta"];
      meta.push(i);
    	path_metas.push(meta);
      path_uuids_dict[i] = paths['Vemurafenib_1_1_MMACSF'][i]['path'];
    }
    table_data = [path_metas];
    table = $('#path_table').DataTable( {
      data: table_data[0]
    } );
  });

$(function(){

  var win = $(window);

  // build the dropdown pickers
  grabJSON('static/cell_dict.json').then(
    function(ajax_response){
      var prebuilt_models = {"McCormick":"McCormick"};
      dropdownFromJSON('#model_picker', prebuilt_models);
      }
  );


  grabJSON('static/models/Fallahi_mass_spec/fallahi_select.json').then(
    function(ajax_response){
      select_array =  ajax_response;
      sub_select_array = select_array;
      build_ctx_dropdowns(sub_select_array, ctx_select_divs, current_ctx_selection);
    });


  // build the dropdown pickers
  grabJSON('static/cell_dict.json').then(
    function(ajax_response){
      var interesting_lines = {"A101D_SKIN":"model_A101D_SKIN.json", "LOXIMVI_SKIN":"model_LOXIMVI_SKIN.json"};
      for (var d of ['#cellSelectStatic', '#cellSelectDynamic']) {
          dropdownFromJSON(d, interesting_lines);
          $(d).append($('<option data-divider="true"/>'));
        }
      for (var d of ['#cellSelectStatic', '#cellSelectDynamic']) {
          dropdownFromJSON(d, ajax_response);
        }
      }
  );

  // set the preset_pos
  setPresetPos();

  $("#loadButtonDynamic").click(function(){
    var txt = $('#textArea')[0].value;
    setPresetPos();
    txtProcess(txt, parser).then(groundingMapper).then(assembleCyJS).then(function (model_response) {
      drawCytoscape('cy_1', model_response);
      qtipNodes(scapes['cy_1']);
      $('#menu').modal('hide');
    });
    $('.cyjs2loopy').prop('disabled', false);
  });

  $("#loadContextButton").click(function(){
    var cell_line = $('#cellSelectDynamic').val().slice(6,-5);
    contextualizeNodesCCLE(cy, cell_line);
    $('#menu').modal('hide');
  });

  $("#downloadPySB").click(function(){
    var txt = $('#textArea')[0].value;
    txtProcess(txt, parser).then(groundingMapper).then(assemblePySB).then(function (res) {
      download('model.py', res['model']);
    });
  });

  $("#downloadSBML").click(function(){
    var txt = $('#textArea')[0].value;
    txtProcess(txt, parser).then(groundingMapper).then(assembleSBML).then(function (res) {
      download('model.sbml', res['model']);
    });
  });

  $("#downloadSBGN").click(function(){
    var txt = $('#textArea')[0].value;
    txtProcess(txt, parser).then(groundingMapper).then(assembleSBGN).then(function (res) {
      download('model.sbgn', res['model']);
    });
  });

  $("#downloadKappa").click(function(){
    var txt = $('#textArea')[0].value;
    txtProcess(txt, parser).then(groundingMapper).then(assembleKappa).then(function (res) {
      download('model.ka', res['model']);
    });
  });

  $("#downloadBNGL").click(function(){
    var txt = $('#textArea')[0].value;
    txtProcess(txt, parser).then(groundingMapper).then(assembleBNGL).then(function (res) {
      download('model.bngl', res['model']);
    });
  });

  $("#downloadCX").click(function(){
    var txt = $('#textArea')[0].value;
    txtProcess(txt, parser).then(groundingMapper).then(assembleCX).then(function (res) {
      download('model.cx', res['model']);
    });
  });

  $("#NDEX").click(function(){
    var txt = $('#textArea')[0].value;
    var modal = $('#ndexModal')
    var modal_body = modal.find('.modal-body')[0]
    modal_body.innerHTML = null
    var par = document.createElement("p");
    par.textContent = 'Uploading model to NDEX...'
    modal_body.append(par)
    txtProcess(txt, parser).then(groundingMapper).then(shareNDEX).then(function (res) {
      par.textContent = 'Network uploaded to NDEX.'
      var par2 = document.createElement("p");
      var network_address =  "http://ndexbio.org/#/network/" + res['network_id']
      var temp_link = document.createElement("a");
      temp_link.href = network_address;
      temp_link.text = network_address;
      temp_link.target = '_blank';
      par2.append(temp_link);
      modal_body.append(par2);
    });
  });

  $("#downloadINDRA").click(function(){
    var txt = $('#textArea')[0].value;
    txtProcess(txt, parser).then(groundingMapper).then(function (res) {
      download('stmts.json', JSON.stringify(res['statements'], null, 2));
    });
  });


  $("#downloadPNG").click(function(){
    var cypng = scapes['cy_1'].png({scale: 3})
    var dl = document.createElement('a');
    dl.href = cypng;
    dl.download = 'graph.png';
    HTMLElement.prototype.click = function() {
    var evt = this.ownerDocument.createEvent('MouseEvents');
    evt.initMouseEvent('click', true, true, this.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    this.dispatchEvent(evt);
    }    
    dl.click();

  });


  $("#loopy").click(function(){
    var txt = $('#textArea')[0].value;

    txtProcess(txt, parser).then(groundingMapper).then(assembleLoopy).then(function (res) {

        window.open(
          res['loopy_url'].toString(),
          "_blank"
        );
    });
  });


$("#loadButtonStatic").click(function(){
  setPresetPos();
  grabJSON('static/models/' + prebuilt_model + '/model.json').then(function (model_response) {
    drawCytoscape ('cy_1', model_response);
    qtipNodes(scapes['cy_1']);
    $('#menu').modal('hide');

  });
  $('.cyjs2loopy').prop('disabled', false);
});

$(".cyjs2loopy").click(function(){
  var model = loopyFromCyJS("cy_1");
  window.open(
    'http://ncase.me/loopy/v1/?data=' + model,
    "_blank"
  );
});

$(".presetLayout").click(function(){
  if (this.classList.contains("active")){
    $(".presetLayout").removeClass("active");
    preset_pos = {};
  }
  else {
    $(".presetLayout").addClass("active");
    preset_pos = preset_pos_static;
  }
});

$('a[href="#byom"]').click(function(){
  if (this.classList.contains("active") === false){
    preset_pos = {};
  }
});

$("#parseReach").click(function(){
  if (this.classList.contains("active")){
    $("#parseReach").removeClass("active");
    $("#parseTrips").addClass("active");
    parser='trips';
  }
  else {
    $("#parseReach").addClass("active");
    $("#parseTrips").removeClass("active");
    parser='reach';
  }
});


$("#parseTrips").click(function(){
  if (this.classList.contains("active")){
    $("#parseTrips").removeClass("active");
    $("#parseReach").addClass("active");
    parser='reach';
  }
  else {
    $("#parseTrips").addClass("active");
    $("#parseReach").removeClass("active");
    parser='trips';
  }
});

$('a[href="#ras227"]').click(function(){
  preset_pos = preset_pos_static;
});

// change prebuilt_model name every time the user changes dropdown
$('#model_picker').on('changed.bs.select', function(){
  prebuilt_model = $('#model_picker').selectpicker('val');
});

// change prebuilt_model name every time the user changes dropdown
$('.ctx-select').on('changed.bs.select', function(){
  var div_id = "#" + this.id;
  var val = $(div_id).selectpicker('val');
  current_ctx_selection[ctx_select_divs.indexOf(div_id)] = val;
  sub_select_array = array_multifilter(sub_select_array, current_ctx_selection);
  clearCtxtSelects();
  build_ctx_dropdowns(sub_select_array, ctx_select_divs, current_ctx_selection);
});

$("#reset_filter").click(function(){
  sub_select_array = select_array;
  current_ctx_selection = new Array(ctx_select_divs.length).fill("");
  clearCtxtSelects();
  build_ctx_dropdowns(sub_select_array, ctx_select_divs, current_ctx_selection);
  grabJSON('static/models/' + prebuilt_model + '/model.json').then(function (model_response) {
    drawCytoscape ('cy_1', model_response);
    qtipNodes(scapes['cy_1']);
  });
});

$("#load_context").click(function(){
  condition = current_ctx_selection.join('_');
  phosphoContextSN(scapes['cy_1'], ctxt, condition);
});

$('#path_table').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            path_id = this.childNodes[5].innerText;
            highlightPath(scapes['cy_1'], path_uuids_dict[path_id]);
        }
    } );


// destroy cy on tab change
// don't really want this
// $('a[data-toggle=tab]').click(function(){
//     cy.destroy();
//     console.log(this.href);
// });

// get all divs of class cy
// get their data-url location
// draw them!
$('.cy').each(function(){
    var div_id = $(this).attr('id');
    var data_model = $(this).attr('data-url');
    setPresetPos();
    grabJSON('static/models/' + prebuilt_model + '/model.json').then(function (model_response) {
      drawCytoscape ('cy_1', model_response);
      qtipNodes(scapes['cy_1']);
    });
    console.log($(this).attr('da;ta-url'));
});

function resize() {
  $(".cy-container").height(win.innerHeight() - 250);
  $(".cy").height(win.innerHeight() - 250);
  scapes['cy_1'].center();
}

var resizeTimer;
$(window).on('resize', function(e) {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    resize();
  }, 250);
});
setTimeout(resize, 0);

$('.modal').on('show.bs.modal', function (e) {
    $(".cy-panzoom").css({"display": "none"});
});
$('.modal').on('hidden.bs.modal', function (e) {
    $(".cy-panzoom").css({"display": "unset"});
});


});// dom ready
