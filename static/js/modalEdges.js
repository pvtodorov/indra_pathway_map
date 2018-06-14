function modalEdges(cy){
    cy.edges().on('click', function(e){
        var current_edge = this;
        var src_tar_list = getSourcesTargets(current_edge)
        var edge_uuids = getUUIDs(current_edge)
        // console.log(src_tar_list);
        // console.log(edge_uuids)
        var sources = src_tar_list[0];
        var targets = src_tar_list[1];
        $('#edgeModal').modal('show')
        var sources_div = $('#edgeModal').find('.modal-body').find('.edgeModal-sources')[0]
        sources_div.innerHTML = null
        for (var s of sources){
            var source_button = document.createElement("button");
            source_button.classList.add('btn')
            source_button.classList.add('btn-default')
            source_button.classList.add('btn-src')
            source_button.textContent = s.data().name
            source_button.dataset.id = s.data().id
            sources_div.appendChild(source_button)
            sources_div.append(" ")
        }
        var targets_div = $('#edgeModal').find('.modal-body').find('.edgeModal-targets')[0]
        targets_div.innerHTML = null
        for (var t of targets){
            var target_button = document.createElement("button");
            target_button.classList.add('btn')
            target_button.classList.add('btn-default')
            target_button.classList.add('btn-targ')
            target_button.textContent = t.data().name
            target_button.dataset.id = t.data().id
            targets_div.appendChild(target_button)
            targets_div.append(" ")
            
        }
        var f_uuids = getFilteredUUIDs(current_edge);
        deactivateAllButtons()
        updateStmtsBox(f_uuids)
        $(".btn-src").on('click', function(b){
            toggleButton(b.target)
            f_uuids = getFilteredUUIDs(current_edge)
            console.log(f_uuids)
            updateStmtsBox(f_uuids)
        })
        $(".btn-targ").on('click', function(b){
            toggleButton(b.target)
            f_uuids = getFilteredUUIDs(current_edge)
            console.log(f_uuids)
            updateStmtsBox(f_uuids)
        })
    })
}


function getSourcesTargets(edge){
    var sources = [];
    var source = edge.source();
    if (source.isParent()){
        console.log('source is compound');
        var children = source.children();
        children.forEach(function (child) {
            sources.push(child)
        })
    }
    else {
        sources.push(source);
    }
    var targets = [];
    var target = edge.target();
    if (target.isParent()){
        console.log('target is compound');
        var children = target.children();
        children.forEach(function (child) {
            targets.push(child)
        })
    }
    else {
        targets.push(target);
    }
    return [sources, targets];
}

function getUUIDs(ele){
    return ele.data().uuid_list
}

function filterUUIDs(e1, e2, e3){
    var s_uuids = new Set(e1.data().uuid_list);
    var t_uuids = new Set(e2.data().uuid_list);
    var e_uuids = new Set(e3.data().uuid_list);
    f_uuids = intersection(s_uuids, t_uuids);
    f_uuids = intersection(f_uuids, e_uuids);
    return f_uuids

}

function intersection(setA, setB) {
    var _intersection = new Set();
    for (var elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem);
        }
    }
    return _intersection;
}

modalEdges(cy);

// statements.filter(st => st.id == "afb92699-ccad-4cef-a56c-adda79a7688a")


function toggleButton(button){
    var button_classes = ["btn-src", "btn-targ"];
    for (var button_class of button_classes){
        if ([...button.classList].indexOf(button_class) !== -1){
            var class_str = "." + button_class
            for (b of $(class_str)){
                b.classList.remove('active')
            }
        }
    }
    button.classList.add('active')
}

function deactivateAllButtons(){
    var button_classes = ["btn-src", "btn-targ"];
    for (var button_class of button_classes){
        var class_str = "." + button_class
        for (b of $(class_str)){
            b.classList.remove('active')
        }
    }
}

function getActiveButtons(){
    var src_active = $(".btn-src.active")[0]
    var targ_active = $(".btn-targ.active")[0]
    return [src_active, targ_active]
}

function getFilteredUUIDs(edge){
    var active_btns = getActiveButtons()
    var element_array = [edge, edge, edge]
    if (active_btns[0] !== undefined){
        element_array[0] = cy.getElementById(active_btns[0].dataset.id)
    }
    if (active_btns[1] !== undefined){
        element_array[1] = cy.getElementById(active_btns[1].dataset.id)
    }
    console.log(element_array)
    var filtered_uuids = filterUUIDs(...element_array)
    return filtered_uuids
}

function updateStmtsBox(uuid_list){
    var stmts_box = $('#edgeModal').find('.modal-body').find('.edgeModal-stmtsbox')[0]
    stmts_box.innerHTML = null
    for (var u of uuid_list){
        if (stmts !== undefined){
            var statement = stmts.responseJSON.statements.filter(st => st.id == u)
            var panel = document.createElement("div");
            panel.classList.add('panel')
            panel.classList.add('panel-default')
            var panel_body = document.createElement("div")
            panel_body.classList.add('panel-body')
            var par = document.createElement("p")
            par.textContent = JSON.stringify(statement, null, 2)
            var ev_button = document.createElement("button");
            ev_button.classList.add('btn', 'btn-default', 'btn-evidence', 'pull-right')
            ev_button.textContent = "Get evidence"
            ev_button.dataset.id = u
            panel_body.appendChild(par)
            panel_body.appendChild(ev_button)
            panel.appendChild(panel_body)
            stmts_box.appendChild(panel)}
    }
}
