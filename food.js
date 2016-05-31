/* global jQuery */
/* global food */
/* global drawSim */

var foodTable = document.getElementById("food");
var foodId = 0;

function updateFoodTable() {

    if (food.length > 0) {

        var l = foodTable.rows.length;

        for (var i = 0; i < l; i++) {
            foodTable.deleteRow(0);
        }

        var header = foodTable.createTHead();
        var hrow = header.insertRow(0);



        for (var key in food[0]) {
            if (food[0].hasOwnProperty(key)) {
                var cell = hrow.insertCell(-1);
                cell.innerHTML = "<b>" + key + "</b>";
            }
        }



        var footer = foodTable.createTFoot();
        var frow = footer.insertRow(-1);

        for (var key in food[0]) {
            if (food[0].hasOwnProperty(key)) {
                var cell = frow.insertCell(-1);
                var data = food[0][key];

                if (key === "Food") {
                    cell.innerHTML = "<span id=\"" + key + "FoodInput\"></span>";
                }
                else {
                    if (typeof data === "string") {
                        cell.innerHTML = "<input id=\"" + key + "FoodInput\" type=\"text\">";
                    }
                    else if (typeof data === "boolean") {
                        cell.innerHTML = "<input id=\"" + key + "FoodInput\" type=\"checkbox\">";
                    }
                    else if (typeof data === "number") {
                        cell.innerHTML = "<input id=\"" + key + "FoodInput\" type=\"number\">";
                    }
                }
            }
        }

        frow.insertCell(-1).innerHTML = "<button onclick=\"updateFood()\">Update</button>";
        frow.insertCell(-1).innerHTML = "<button onclick=\"clearTmpFood()\">Clear</button>";

        for (i = 0; i < food.length; i++) {

            var row = foodTable.insertRow(i + 1);

            for (var key in food[i]) {
                if (food[i].hasOwnProperty(key)) {
                    var cell = row.insertCell(-1);
                    var data = food[i][key];

                    if (key === "Food") {
                        cell.innerHTML = food[i][key];
                    }
                    else {
                        if (typeof data === "string") {
                            cell.innerHTML = food[i][key];
                        }
                        else if (typeof data === "boolean") {
                            cell.innerHTML = food[i][key];
                        }
                        else if (typeof data === "number") {
                            cell.innerHTML = food[i][key];
                        }
                    }
                }
            }

            row.insertCell(-1).innerHTML = "<button onclick=\"editFood(" + food[i]["Food"] + ")\">Edit</button>";
            row.insertCell(-1).innerHTML = "<button onclick=\"deleteFood(" + food[i]["Food"] + ")\">Delete</button>";

        }

    }
    else {
        var l = foodTable.rows.length;

        for (i = 0; i < l; i++) {
            foodTable.deleteRow(0);
        }
        foodTable.insertRow(0).innerHTML = "No food";
    }
}

function updateFood() {

    var tmpfood = {};

    var update = true;

    for (var key in food[0]) {
        if (food[0].hasOwnProperty(key)) {
            var data = food[0][key];
            if (key === "Food") {
                tmpfood[key] = Number(document.getElementById(key + "FoodInput").innerHTML);
                if (document.getElementById(key + "FoodInput").innerHTML == "") {
                    update = false;
                }
            }
            else {
                if (typeof data === "string") {
                    tmpfood[key] = document.getElementById(key + "FoodInput").value;
                }
                else if (typeof data === "boolean") {
                    tmpfood[key] = document.getElementById(key + "FoodInput").checked;
                }
                else if (typeof data === "number") {
                    tmpfood[key] = Number(document.getElementById(key + "FoodInput").value);
                }
            }
        }
    }

    if (!update) {
        tmpfood["Food"] = ++foodId;
        food[food.length] = jQuery.extend(true, {}, tmpfood);
    }
    else {
        for (var f = 0; f < food.length; f++) {
            if (food[f]["Food"] === tmpfood["Food"]) {
                food[f] = jQuery.extend(true, {}, tmpfood);
            }
        }
    }

    updateFoodTable();
    drawSim();
}

function clearTmpFood() {
    for (var key in food[0]) {
        if (food[0].hasOwnProperty(key)) {
            var data = food[0][key];
            if (key === "Food") {
                document.getElementById(key + "FoodInput").innerHTML = "";
            }
            else {
                if (typeof data === "string") {
                    document.getElementById(key + "FoodInput").value = "";
                }
                else if (typeof data === "boolean") {
                    document.getElementById(key + "FoodInput").checked = false;
                }
                else if (typeof data === "number") {
                    document.getElementById(key + "FoodInput").value = "";
                }
            }
        }
    }
}

function editFood(id) {

    var l = food.length;

    var tmpfood = {};

    for (var i = 0; i < l; i++) {
        if (food[i]["Food"] === id) {
            tmpfood = jQuery.extend(true, {}, food[i]);
        }
    }

    for (var key in food[0]) {
        if (food[0].hasOwnProperty(key)) {
            var data = food[0][key];
            console.log(key);
            if (key === "Food") {
                document.getElementById(key + "FoodInput").innerHTML = tmpfood[key];
            }
            else {
                if (typeof data === "string") {
                    document.getElementById(key + "FoodInput").value = tmpfood[key];
                }
                else if (typeof data === "boolean") {
                    document.getElementById(key + "FoodInput").checked = tmpfood[key];
                }
                else if (typeof data === "number") {
                    document.getElementById(key + "FoodInput").value = tmpfood[key];
                }
            }
        }
    }
}

function deleteFood(id) {

    if (food.length > 1) {

        food.splice(id, 1);

        //for (var i = 0; i < food.length; i++) {
        //    food[i]["Food"] = i;
        //}

        updateFoodTable();
        drawSim();
    }
}

function printFood() {

    var s = "";

    for (var i = 0; i < food.length; i++) {
        for (var key in food[i]) {
            if (food[i].hasOwnProperty(key)) {
                s += key + ": " + food[i][key] + " ";
            }
        }
        key += "    ";
    }

    return s;
}