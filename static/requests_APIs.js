// retrieve a JSON from a url
//***************************************
function grabJSON (url) {
  return $.ajax({
    url: url,
  })
}
//***************************************

//build bootstrap-select dropdown using json
//***************************************
function dropdownFromJSON (div_id, ajax_response) {
  $.each(ajax_response, function(name, file) {
       $(div_id).append($('<option/>').attr("value", file).text(name));
    });
  $('.selectpicker').selectpicker('refresh');
}
//***************************************

// get preset_pos for McCormick model
//***************************************
// function to set preset_pos for McCormick model
//***************************************
function setPresetPos () {
  grabJSON("static/preset_pos.json").then(function (ajax_response) {
    preset_pos = ajax_response;
    preset_pos_static = preset_pos
  })
}
//***************************************


//download a model
//***************************************
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
//***************************************

//send text to REACH, get back stmts
//***************************************
function txtReach(txt) {
  var input_txt = {'text':txt}
  console.log(input_txt)
  console.log("converting text to statements via REACH");
  return $.ajax({
                url: indra_server_addr + "/reach/process_text",
                type: "POST",
                dataType: "json",
                data: JSON.stringify(input_txt),
                });
}

// send stmts to grounding mapper, get grounded stmts
//***************************************
function groundingMapper(res) {
  var stmts = res
  return $.ajax({
                url: indra_server_addr + "/preassembly/map_grounding",
                type: "POST",
                dataType: "json",
                data: JSON.stringify(stmts),
                });
}
//***************************************


function assembleCyJS(res) {
  var res_json = res
  res_json['line'] = $('#cellSelectDynamic').val().slice(6,-5)
  console.log(res_json)
  console.log("converting statements to cyjs");
  return $.ajax({
      url: indra_server_addr + "/assemblers/cyjs",
      type: "POST",
      dataType: "json",
      data: JSON.stringify(res_json),
  });
}

function assemblePySB(res) {
  var res_json = res
  res_json['line'] = $('#cellSelectDynamic').val().slice(6,-5)
  console.log(res_json)
  console.log("converting statements to cyjs");
  return $.ajax({
      url: indra_server_addr + "/assemblers/pysb",
      type: "POST",
      dataType: "json",
      data: JSON.stringify(res_json),
  });
}

function assembleLoopy(res) {
  var res_json = res
  res_json['line'] = $('#cellSelectDynamic').val().slice(6,-5)
  console.log(res_json)
  console.log("converting statements to cyjs");
  return $.ajax({
      url: indra_server_addr + "/assemblers/sif/loopy",
      type: "POST",
      dataType: "json",
      data: JSON.stringify(res_json),
  });
}
