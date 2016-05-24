/* global $ */
/* global jQuery */
/* global updateIndsTable */
/* global updateFoodTable */
/* global foodId */
/* global indId */

var WIDTH = 10;
var HEIGHT = 10;

var table = document.getElementById("sim");

var individuals = Array({});
var food = Array({});

var runTimer;
var runDelay = 1000;
var runTime = 0;

var foodNum = 1;

var foodValue = 3;
var moveFood = 1;

var indMax = 20;

$(document).ready(function() {

    for (var i = 0; i < WIDTH; i++) {
        var row = table.insertRow(-1);
        for (var j = 0; j < HEIGHT; j++) {
            row.insertCell(-1);
        }
    }

    individuals[0]["Individual"] = 0;
    individuals[0]["X Pos"] = 1;
    individuals[0]["Y Pos"] = 2;
    individuals[0]["Energy"] = 10;

    updateIndsTable();

    food[0]["Food"] = 0;
    food[0]["X Pos"] = 3;
    food[0]["Y Pos"] = 4;

    updateFoodTable();

    drawSim();

});

$("#run").click(function() {
    runDelay = $("#delay").val();
    runTimer = window.setInterval(updateSim, runDelay);
});

$("#stop").click(function() {
    window.clearInterval(runTimer);
    $("#state").text("Not Running");
});

function drawSim() {

    runTime += runDelay / 1000;

    $("#state").text("Running for " + runTime.toFixed(1) + " seconds");

    for (var i = 0; i < WIDTH; i++) {
        for (var j = 0; j < HEIGHT; j++) {
            table.rows[j].cells[i].innerHTML = "";
            table.rows[j].cells[i].style.backgroundColor = "white";
        }
    }

    for (var i = 0; i < individuals.length; i++) {

        var color = (individuals[i]["Energy"] / indMax);

        table.rows[individuals[i]["Y Pos"]].cells[individuals[i]["X Pos"]].style.backgroundColor = "rgba(" +
            255 + "," +
            0 + "," +
            0 + "," + 
            color + 
        ")";
        
        table.rows[individuals[i]["Y Pos"]].cells[individuals[i]["X Pos"]].innerHTML = "Ind " + individuals[i]["Individual"];
    }

    for (var i = 0; i < food.length; i++) {
        table.rows[food[i]["Y Pos"]].cells[food[i]["X Pos"]].innerHTML = "Food " + food[i]["Food"];
        table.rows[food[i]["Y Pos"]].cells[food[i]["X Pos"]].style.backgroundColor = "green";
    }
}


function updateSim() {
    for (var i = 0; i < individuals.length; i++) {
        if (food.length > 0) {
            var minx = food[0]["X Pos"];
            var miny = food[0]["Y Pos"];
            var mind = Math.sqrt(
                (individuals[i]["X Pos"] - food[0]["X Pos"]) * (individuals[i]["X Pos"] - food[0]["X Pos"]) +
                (individuals[i]["Y Pos"] - food[0]["Y Pos"]) * (individuals[i]["Y Pos"] - food[0]["Y Pos"])
            );
            var minf = food[0];

            for (var j = 1; j < food.length; j++) {

                var ix = individuals[i]["X Pos"];
                var iy = individuals[i]["Y Pos"];

                var fx = food[j]["X Pos"];
                var fy = food[j]["Y Pos"];

                var dist = Math.sqrt(
                    (ix - fx) * (ix - fx) +
                    (iy - fy) * (iy - fy)
                );

                if (dist < mind) {
                    minx = fx;
                    miny = fy;
                    mind = dist;
                    minf = j;
                }

            }

            var dx = minx - individuals[i]["X Pos"];
            var dy = miny - individuals[i]["Y Pos"];


            if (Math.abs(dx) > Math.abs(dy)) {
                individuals[i]["X Pos"] += Math.sign(dx);
            }
            else {
                individuals[i]["Y Pos"] += Math.sign(dy);
            }

            individuals[i]["Energy"] -= moveFood;

            var dx2 = minx - individuals[i]["X Pos"];
            var dy2 = miny - individuals[i]["Y Pos"];

            if (dx2 === 0 && dy2 === 0) {

                individuals[i]["Energy"] += foodValue;

                food.splice(minf, 1);


                if (individuals[i]["Energy"] >= indMax) {
                    for (var f = 0; f < individuals.length; f++) {
                        if (individuals[f]["Individual"] === individuals[i]["Individual"]) {
                            individuals.splice(f, 1);
                        }
                    }

                    var tmp1 = {};

                    tmp1["Individual"] = ++indId;
                    tmp1["X Pos"] = minx;
                    tmp1["Y Pos"] = miny;
                    tmp1["Energy"] = 10;

                    individuals[individuals.length] = jQuery.extend(true, {}, tmp1);

                    var tmp2 = {};

                    tmp2["Individual"] = ++indId;
                    tmp2["X Pos"] = (minx === WIDTH - 1 ? minx - 1 : minx + 1);
                    tmp2["Y Pos"] = miny;
                    tmp2["Energy"] = 10;

                    individuals[individuals.length] = jQuery.extend(true, {}, tmp2);
                }
            }

            if (individuals[i]["Energy"] <= 0) {
                for (var f = 0; f < individuals.length; f++) {
                    if (individuals[f]["Individual"] === individuals[i]["Individual"]) {
                        individuals.splice(f, 1);
                    }
                }
            }
        }
    }

    if ($("#foodBox").prop("checked")) {
        for (var i = 0; i < foodNum; i++) {
            var tmpFood = {};

            var x = Math.round(Math.random() * (WIDTH - 1));
            var y = Math.round(Math.random() * (HEIGHT - 1));

            var found = false;

            for (var i = 0; i < food.length; i++) {
                if (food[i]["X Pos"] === x && food[i]["Y Pos"] === y) {
                    found = true;
                }
            }

            for (var i = 0; i < individuals.length; i++) {
                if (individuals[i]["X Pos"] === x && individuals[i]["Y Pos"] === y) {
                    found = true;
                }
            }

            if (!found) {
                tmpFood["Food"] = ++foodId;
                tmpFood["X Pos"] = x;
                tmpFood["Y Pos"] = y;

                food[food.length] = tmpFood;
            }
        }
    }
    updateIndsTable();
    updateFoodTable();
    drawSim();
}