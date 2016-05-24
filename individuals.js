/* global jQuery */
/* global individuals */
/* global drawSim */

var indTable = document.getElementById("ind");
var indId = 0;

function updateIndsTable() {



    if (individuals.length > 0) {


        var l = indTable.rows.length;

        for (var i = 0; i < l; i++) {
            indTable.deleteRow(0);
        }

        var header = indTable.createTHead();
        var hrow = header.insertRow(0);



        for (var key in individuals[0]) {
            if (individuals[0].hasOwnProperty(key)) {
                var cell = hrow.insertCell(-1);
                cell.innerHTML = "<b>" + key + "</b>";


            }
        }



        var footer = indTable.createTFoot();
        var frow = footer.insertRow(-1);

        for (var key in individuals[0]) {
            if (individuals[0].hasOwnProperty(key)) {
                var cell = frow.insertCell(-1);
                var data = individuals[0][key];

                if (key === "Individual") {
                    cell.innerHTML = "<span id=\"" + key + "Input\"></span>";
                }
                else {
                    if (typeof data === "string") {
                        cell.innerHTML = "<input id=\"" + key + "Input\" type=\"text\">";
                    }
                    else if (typeof data === "boolean") {
                        cell.innerHTML = "<input id=\"" + key + "Input\" type=\"checkbox\">";
                    }
                    else if (typeof data === "number") {
                        cell.innerHTML = "<input id=\"" + key + "Input\" type=\"number\">";
                    }
                }
            }
        }

        frow.insertCell(-1).innerHTML = "<button onclick=\"updateIndividual()\">Update</button>";
        frow.insertCell(-1).innerHTML = "<button onclick=\"clearTmpIndividual()\">Clear</button>";

        for (i = 0; i < individuals.length; i++) {

            var row = indTable.insertRow(i + 1);

            for (var key in individuals[i]) {
                if (individuals[i].hasOwnProperty(key)) {
                    var cell = row.insertCell(-1);
                    var data = individuals[i][key];

                    if (key === "Individual") {
                        cell.innerHTML = individuals[i][key];
                    }
                    else {
                        if (typeof data === "string") {
                            cell.innerHTML = individuals[i][key];
                        }
                        else if (typeof data === "boolean") {
                            cell.innerHTML = individuals[i][key];
                        }
                        else if (typeof data === "number") {
                            cell.innerHTML = individuals[i][key];
                        }
                    }
                }
            }

            row.insertCell(-1).innerHTML = "<button onclick=\"editIndividual(" + individuals[i]["Individual"] + ")\">Edit</button>";
            row.insertCell(-1).innerHTML = "<button onclick=\"deleteIndividual(" + individuals[i]["Individual"] + ")\">Delete</button>";

        }

        //oldInds = individuals;

    }
    else {
        var l = indTable.rows.length;

        for (i = 0; i < l; i++) {
            indTable.deleteRow(0);
        }
        indTable.insertRow(0).innerHTML = "No Individuals";
    }
}

function updateIndividual() {

    var tmpInd = {};

    var update = true;

    for (var key in individuals[0]) {
        if (individuals[0].hasOwnProperty(key)) {
            var data = individuals[0][key];
            if (key === "Individual") {
                tmpInd[key] = Number(document.getElementById(key + "Input").innerHTML);
                if (document.getElementById(key + "Input").innerHTML == "") {
                    update = false;
                }
            }
            else {
                if (typeof data === "string") {
                    tmpInd[key] = document.getElementById(key + "Input").value;
                }
                else if (typeof data === "boolean") {
                    tmpInd[key] = document.getElementById(key + "Input").checked;
                }
                else if (typeof data === "number") {
                    tmpInd[key] = Number(document.getElementById(key + "Input").value);
                }
            }
        }
    }

     if (!update) {
        tmpInd["Individual"] = ++indId;
        individuals[individuals.length] = jQuery.extend(true, {}, tmpInd);
    }else{
        for (var f = 0; f < individuals.length; f++) {
            if (individuals[f]["Individual"] === tmpInd["Food"]) {
                individuals[f] = jQuery.extend(true, {}, tmpInd);
            }
        }
    }

    updateIndsTable();
    drawSim();
}

function clearTmpIndividual() {
    for (var key in individuals[0]) {
        if (individuals[0].hasOwnProperty(key)) {
            var data = individuals[0][key];
            if (key === "Individual") {
                document.getElementById(key + "Input").innerHTML = "";
            }
            else {
                if (typeof data === "string") {
                    document.getElementById(key + "Input").value = "";
                }
                else if (typeof data === "boolean") {
                    document.getElementById(key + "Input").checked = false;
                }
                else if (typeof data === "number") {
                    document.getElementById(key + "Input").value = "";
                }
            }
        }
    }
}

function editIndividual(id) {



    var l = individuals.length;

    var tmpInd = {};

    for (var i = 0; i < l; i++) {
        if (individuals[i]["Individual"] === id) {
            tmpInd = jQuery.extend(true, {}, individuals[i]);
        }
    }

    for (var key in individuals[0]) {
        if (individuals[0].hasOwnProperty(key)) {
            var data = individuals[0][key];
            console.log(key);
            if (key === "Individual") {
                document.getElementById(key + "Input").innerHTML = tmpInd[key];
            }
            else {
                if (typeof data === "string") {
                    document.getElementById(key + "Input").value = tmpInd[key];
                }
                else if (typeof data === "boolean") {
                    document.getElementById(key + "Input").checked = tmpInd[key];
                }
                else if (typeof data === "number") {
                    document.getElementById(key + "Input").value = tmpInd[key];
                }
            }
        }
    }
}

function deleteIndividual(id) {

    if (individuals.length > 1) {

        individuals.splice(id, 1);

        //for (var i = 0; i < individuals.length; i++) {
        //    individuals[i]["Individual"] = i;
        //}

        updateIndsTable();
        drawSim();
    }
}

function printIndividuals() {

    var s = "";

    for (var i = 0; i < individuals.length; i++) {
        for (var key in individuals[i]) {
            if (individuals[i].hasOwnProperty(key)) {
                s += key + ": " + individuals[i][key] + " ";
            }
        }
        key += "    ";
    }

    return s;
}