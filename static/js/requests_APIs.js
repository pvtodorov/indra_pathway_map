class Requester {
  constructor(modal_obj=$(), current_modal=$()){
    this.counter = 0;
    this.message = "Ready.";
    this.modal_obj = modal_obj;
    this.current_modal;
    this.timeout = window.setTimeout(0);
  }

  update_state(message){
    this.counter += 1;
    if (this.message != message){
      // do we have a different message? change it!
      // will toggle modal to show here
      this.message = message;
      clearTimeout(this.timeout)
      console.log('different ' + this.message)
      if ((this.message == "Ready.") && (this.counter%2 == 0)){
        // timeout here will hide modal. need even number of sent
        // and completed ajax requests and a "Ready" message for 2s
        this.timeout = window.setTimeout(console.log, 2000, this.message)
        console.log('same ' + this.message)
      }
    }
  }

  grabJSON (url, dtype='json') {
    var ajax_params = {
      "url": url,
      "dataType": dtype,
    }
    ajax_params["beforeSend"] = () => (this.update_state("working."))
    ajax_params["complete"] = () => (this.update_state("Ready."))
    return $.ajax(ajax_params);
  }

  make_request (ajax_params, message) {
    var ajax_params = ajax_params;
    ajax_params["beforeSend"] = () => (this.update_state(message))
    ajax_params["complete"] = () => (this.update_state("Ready."))
    return $.ajax(ajax_params);
  }

  txtProcess(txt, parser) {
    var input_txt = {'text':txt};
    var ajax_params = {
      "url": indra_server_addr + "/"+ parser + "/process_text",
      "type": "POST",
      "dataType": "json",
      "data": JSON.stringify(input_txt)
    };
    var message = ("Processing text.");
    stmts = this.make_request(ajax_params, message)
    return stmts
  }

  groundingMapper(res) {
    var ajax_params = {
      "url": indra_server_addr + "/preassembly/map_grounding",
      "type": "POST",
      "dataType": "json",
      "data": JSON.stringify(res),
    };
    var message = ("Grounding INDRA statements.");
    stmts = this.make_request(ajax_params, message)
    return stmts
  }

  getEvidence(res) {
    var ajax_params = {
      "url": indra_server_addr + "/indra_db_rest/get_evidence",
      "type": "POST",
      "dataType": "json",
      "data": JSON.stringify(res),
      }
    var message = ("Querying INDRA DB for statement evidence.");
    var stmts_db = this.make_request(ajax_params, message)
    return stmts_db
  }

  assembleCyJS(res) {
    var res_json = res;
    var ajax_params = {
      "url": indra_server_addr + "/assemblers/cyjs",
      "type": "POST",
      "dataType": "json",
      "data": JSON.stringify(res_json),
    }
    var message = ("Assembling CytoscapeJS model.");
    var cyjs_model = this.make_request(ajax_params, message)
    return cyjs_model
  }
}

//build bootstrap-select dropdown using json
//***************************************
function dropdownFromJSON (div_id, ajax_response) {
  $.each(ajax_response, function(name, file) {
       $(div_id).append($('<option/>').attr("value", file).text(name));
    });
  $('.selectpicker').selectpicker('refresh');
}
//***************************************

//build bootstrap-select dropdown using json
//***************************************
function dropdownCtxtSelectFromJSON (div_id, ajax_response) {
  $.each(ajax_response, function(name, file) {
       $(div_id).append($('<option/>').attr("value", file).text(file));
    });
}
//***************************************


//download a model
//***************************************
function download(exportName, exportObj){
  if (exportName.includes('.png')){
    encoding_type = "image/png";
    var data = atob( exportObj.substring( "data:image/png;base64,".length ) ),
    asArray = new Uint8Array(data.length);
    for( var i = 0, len = data.length; i < len; ++i ) {
        asArray[i] = data.charCodeAt(i);    
    }
    var blob = new Blob( [ asArray.buffer ], {type: "image/png"} );
  }
  else {
    var blob = new Blob([exportObj], {type: "text/plain;charset=utf-8"});
  }
  saveAs(blob, exportName);
}

function assembleEnglish(res) {
  var res_json = res;
  return $.ajax({
      url: indra_server_addr + "/assemblers/english",
      type: "POST",
      dataType: "json",
      data: JSON.stringify(res_json),
  });
}

function requestPySB(res, export_format=null) {
  var res_json = res;
  res_json['line'] = $('#cellSelectDynamic').val().slice(6,-5);
  if (export_format){
    res_json['export_format'] = export_format;
    }
  return $.ajax({
      url: indra_server_addr + "/assemblers/pysb",
      type: "POST",
      dataType: "json",
      data: JSON.stringify(res_json),
  });
}

function assembleCX(res) {
  var res_json = res;
  res_json['cyjs_model'] = JSON.stringify(cy.json())
  return $.ajax({
      url: indra_server_addr + "/assemblers/cx",
      type: "POST",
      dataType: "json",
      data: JSON.stringify(res_json),
  });
}

function shareNDEX(model_elements, preset_pos, stmts, sentences, evidence, cell_line, mrna, mutations, txt_input, parser) {
  var res_json = {};
  res_json['stmts'] = JSON.stringify(stmts);
  res_json['model_elements'] = JSON.stringify(model_elements);
  res_json['preset_pos'] = JSON.stringify(preset_pos);
  res_json['sentences'] = JSON.stringify(sentences);
  res_json['evidence'] = JSON.stringify(evidence);
  res_json['cell_line'] = cell_line;
  res_json['mrna'] = JSON.stringify(mrna);
  res_json['mutations'] = JSON.stringify(mutations);
  res_json['txt_input'] = txt_input;
  res_json['parser'] = parser;
  return $.ajax({
      url: indra_server_addr + "/share_model_ndex",
      type: "POST",
      dataType: "json",
      data: JSON.stringify(res_json),
  });
}


function getNDEX(network_id) {
  var res_json = {"network_id": network_id};
  return $.ajax({
      url: indra_server_addr + "/fetch_model_ndex",
      type: "POST",
      dataType: "json",
      data: JSON.stringify(res_json),
  });
}


function assemblePySB(res) {
  return requestPySB(res);
  }

function assembleSBML(res) {
    return requestPySB(res, 'sbml');
    }

function assembleSBGN(res) {
    return requestPySB(res, 'sbgn');
    }

function assembleBNGL(res) {
    return requestPySB(res, 'bngl');
    }

function assembleKappa(res) {
    return requestPySB(res, 'kappa');
    }



function assembleLoopy(res) {
  var res_json = res;
  return $.ajax({
      url: indra_server_addr + "/assemblers/sif/loopy",
      type: "POST",
      dataType: "json",
      data: JSON.stringify(res_json),
  });
}

function get_ccle_mrna(gene_list, cell_line) {
  var input_txt = {'gene_list': gene_list,
                   'cell_lines': [cell_line]};
  return $.ajax({
            url: indra_server_addr + "/databases/cbio/get_ccle_mrna",
            type: "POST",
            dataType: "json",
            data: JSON.stringify(input_txt),
           })
}

function get_ccle_cna(gene_list, cell_line) {
  var input_txt = {'gene_list': gene_list,
                   'cell_lines': [cell_line]};
  return $.ajax({
            url: indra_server_addr + "/databases/cbio/get_ccle_cna",
            type: "POST",
            dataType: "json",
            data: JSON.stringify(input_txt),
           })
}

function get_ccle_mutations(gene_list, cell_line) {
  var input_txt = {'gene_list': gene_list,
                   'cell_lines': [cell_line]};
  return $.ajax({
            url: indra_server_addr + "/databases/cbio/get_ccle_mutations",
            type: "POST",
            dataType: "json",
            data: JSON.stringify(input_txt),
           })
}

function bind_this (target) {
// taken from https://ponyfoo.com/articles/binding-methods-to-class-instance-objects
  const cache = new WeakMap();
  const handler = {
    get (target, key) {
      const value = Reflect.get(target, key);
      if (typeof value !== 'function') {
        return value;
      }
      if (!cache.has(value)) {
        cache.set(value, value.bind(target));
      }
      return cache.get(value);
    }
  };
  const proxy = new Proxy(target, handler);
  return proxy;
}
