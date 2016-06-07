/* global $ */
/* global jQuery */
/* global updateIndsTable */
/* global updateFoodTable */
/* global foodId */
/* global indId */

var WIDTH = 15;
var HEIGHT = 15;

var table = document.getElementById("sim");

var individuals = Array({});
var food = Array({});

var runTimer;
var runDelay = 1000;
var runTime = 0;

var foodNum = 1;

var foodValue = 2;

var indMax = 40;

var maxSpeed = 10;
var speedAdv = 5.2;
var speedBase = 4;

var startFood = 5;
var startInd = 5;

var csv = document.getElementById("csv");

$(document).ready(function() {
    csv.value = "Step,Individuals,Average Speed,Foods\n";
    
    reset();
});

$("#reset").click(function() {
    reset();
});

function reset(){
    
    for (var i = 0; i < WIDTH; i++) {
        var row = table.insertRow(-1);
        for (var j = 0; j < HEIGHT; j++) {
            row.insertCell(-1);
        }
    }
    
    individuals = Array({});
    food = Array({});
    
    individuals[0]["Individual"] = 0;
    individuals[0]["X Pos"] = WIDTH - 2;
    individuals[0]["Y Pos"] = HEIGHT - 2;
    individuals[0]["Energy"] = indMax;
    individuals[0]["Speed"] = Math.floor(maxSpeed - 1);

    for (var f = 1; f < startInd; f++) {
        var tmpInd = {};

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
            tmpInd["Individual"] = ++indId;
            tmpInd["X Pos"] = x;
            tmpInd["Y Pos"] = y;
            tmpInd["Energy"] = indMax;
            tmpInd["Speed"] = Math.round(Math.random() * (maxSpeed - 1));

            individuals[individuals.length] = tmpInd;
        }
    }


    //updateIndsTable();

    food[0]["Food"] = 0;
    food[0]["X Pos"] = 2;
    food[0]["Y Pos"] = 2;

    for (var f = 1; f < startFood; f++) {
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

    //updateFoodTable();

    drawSim();
}

$("#run").click(function() {
    runDelay = $("#delay").val();
    runTimer = window.setInterval(updateSim, runDelay);
});

$("#stop").click(function() {
    window.clearInterval(runTimer);
    $("#state").text("Not Running");
});

function drawSim() {

    runTime++;

    $("#state").text("Running for " + runTime + " steps");

    for (var i = 0; i < WIDTH; i++) {
        for (var j = 0; j < HEIGHT; j++) {
            //table.rows[j].cells[i].innerHTML = "";
            table.rows[j].cells[i].style.backgroundColor = "white";
        }
    }

    for (var i = 0; i < food.length; i++) {
        //table.rows[food[i]["Y Pos"]].cells[food[i]["X Pos"]].innerHTML = "Food " + food[i]["Food"];
        table.rows[food[i]["Y Pos"]].cells[food[i]["X Pos"]].style.backgroundColor = "green";
    }

    for (var i = 0; i < individuals.length; i++) {
        var individual = individuals[i];

        var xpos = individual["X Pos"];
        var ypos = individual["Y Pos"];

        var color = (individual["Energy"] / indMax);

        table.rows[ypos].cells[xpos].style.backgroundColor = "rgba(" +
            0 + "," +
            0 + "," +
            255 + "," +
            color +
            ")";

        //table.rows[ypos].cells[xpos].innerHTML = "Ind " + individual["Individual"];
    }

}


function updateSim() {

    //var f0x = food[0]["X Pos"];
    //var f0y = food[0]["Y Pos"]

    var sumSpeed = 0;

    for (var i = 0; i < individuals.length; i++) {
        var individual = individuals[i];
        if (runTime % (maxSpeed - individuals[i]["Speed"]) === 0 && food.length > 0) {

            var xpos = individual["X Pos"];
            var ypos = individual["Y Pos"];

            var minx = food[0]["X Pos"];
            var miny = food[0]["Y Pos"];
            var mind = Math.sqrt(
                (xpos - food[0]["X Pos"]) * (xpos - food[0]["X Pos"]) +
                (ypos - food[0]["Y Pos"]) * (ypos - food[0]["Y Pos"])
            );
            var minf = food[0];

            for (var j = 1; j < food.length; j++) {

                var ix = xpos;
                var iy = ypos;

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

            var dx = minx - xpos;
            var dy = miny - ypos;

            if (Math.abs(dx) > Math.abs(dy)) {
                xpos += Math.sign(dx);
            }
            else {
                ypos += Math.sign(dy);
            }

            individual["X Pos"] = xpos;
            individual["Y Pos"] = ypos;

            individual["Energy"] -= Math.floor(speedBase + individual["Speed"] / speedAdv);

            var dx2 = minx - xpos;
            var dy2 = miny - ypos;


            if (dx2 === 0 && dy2 === 0) {

                //individual["Energy"] += foodValue;
                individual["Energy"] += individual["Speed"] * foodValue;

                food.splice(minf, 1);


                if (individual["Energy"] >= indMax) {

                    var tmp1 = {};

                    tmp1["Individual"] = ++indId;
                    tmp1["X Pos"] = minx;
                    tmp1["Y Pos"] = miny;
                    tmp1["Energy"] = maxSpeed * 2;
                    tmp1["Speed"] = individual["Speed"] + (individual["Speed"] < (maxSpeed - 1) ? 1 : 0);


                    var tmp2 = {};

                    tmp2["Individual"] = ++indId;
                    tmp2["X Pos"] = (minx === WIDTH - 1 ? minx - 1 : minx + 1);
                    tmp2["Y Pos"] = miny;
                    tmp2["Energy"] = maxSpeed * 2;
                    tmp2["Speed"] = individual["Speed"] - (individual["Speed"] > 1 ? 1 : 0);

                    for (var f = 0; f < individuals.length; f++) {
                        if (individuals[f]["Individual"] === individual["Individual"]) {
                            individuals.splice(f, 1);
                        }
                    }

                    individuals[individuals.length] = jQuery.extend(true, {}, tmp1);
                    individuals[individuals.length] = jQuery.extend(true, {}, tmp2);

                    //sumSpeed += tmp1["Speed"];
                    //sumSpeed += tmp2["Speed"];
                }
            }
            else if (individual["Energy"] <= 0) {
                for (var f = 0; f < individuals.length; f++) {
                    if (individuals[f]["Individual"] === individual["Individual"]) {
                        individuals.splice(f, 1);
                    }
                }
            }
            else {
                //sumSpeed += individual["Speed"];
            }
        }
    }

    for (var i = 0; i < individuals.length; i++) {
        sumSpeed += individuals[i]["Speed"];
    }

    $("#numInds").text(individuals.length);
    $("#avgSpeed").text((sumSpeed / individuals.length).toFixed(2));
    $("#numFoods").text(food.length);

    for (var i = 0; i < foodNum; i++) {
        var tmpFood = {};

        var x = Math.round(Math.random() * (WIDTH - 1));
        var y = Math.round(Math.random() * (HEIGHT - 1));

        var found = false;

        for (var i = 0, len = food.len; i < len; i++) {
            if (food[i]["X Pos"] === x && food[i]["Y Pos"] === y) {
                found = true;
            }
        }

        for (var i = 0, len = individuals.len; i < len; i++) {
            var individual = individuals[i];

            var xpos = individual["X Pos"];
            var ypos = individual["Y Pos"];

            if (xpos === x && ypos === y) {
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

    //updateIndsTable();
    //updateFoodTable();
    drawSim();

    csv.value += runTime + "," + individuals.length + "," + (sumSpeed / individuals.length) + "," + food.length + "\n";
    csv.scrollTop = csv.scrollHeight;

}