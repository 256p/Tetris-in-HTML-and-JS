'use strict';
    //set pattern on input!!!!!
    var canvas = id('tetris');
    var canvasBackground = id('tetrisBackground');
    var tetris = canvas.getContext('2d');
    var tetrisBackground = canvasBackground.getContext('2d');
    var pointsDIV = id('points');
    var pauseDIV = id('pause');
    var linesDIV = id('lines');
    var figuresDIV = id('figures');
    var CSS = id('css');
    var recordDIV = id('record');
    var canvasNext = id('next');
    var tetrisNext = canvasNext.getContext('2d');
    var restartDIV = id('restart');
    var nextDIV = id('nextWord');
    var titleDIV = id('title');
    var pointsDIV2 = id('points2');
    var linesDIV2 = id('lines2');
    var figuresDIV2 = id('figures2');
    var recordDIV2 = id('record2');
    var gameDIV = id('game');

    var timerId, timerId2, timerId3, figColor, figure, height, width;
    var position = [];
    var limit = [];
    var color = [];
    var allFigures = [];
    var allHeights = [];
    var allWidths = [];
    var allRotates = [];
    var allColors = [];
    var lines = 0;
    var figures = 0;
    var indicator = {
        up: 1,
        down: 1,
        right: 1,
        left: 1,
        space: 0,
        r: 1,
        points: 1,
        name: 1,
        time: 1,
        record: 0
    };
    var rotateIndex = 0;
    var next = Math.random();
    var random = next;

    //Settings
    var X = 180, Y = 0;
    var heightInBlocks = 20;
    var blockWidth = 30;
    var widthInBlocks = 20;
    var speedV = 20;
    var speedH = 100;
    var rotateSpeed = 100;
    var increase = 5;
    //Settings

    var x = X, y = Y;

    //figures
    allFigures.push([ 1, 1, 1, 1 ]);
    allHeights.push(2);
    allWidths.push(2);
    allRotates.push(1);
    allColors.push('#ffcc00');
    allFigures.push([0, 0, 0, 0, 1, 1, 1, 1]);
    allHeights.push(2);
    allWidths.push(4);
    allRotates.push(2);
    allColors.push('#00ffff');
    allFigures.push([1, 0, 0, 1, 1, 1]);
    allHeights.push(2);
    allWidths.push(3);
    allRotates.push(4);
    allColors.push('#ff6600');
    allFigures.push([0, 0, 1, 1, 1, 1]);
    allHeights.push(2);
    allWidths.push(3);
    allRotates.push(4);
    allColors.push('#0000ff');
    allFigures.push([0, 1, 1, 1, 1, 0]);
    allHeights.push(2);
    allWidths.push(3);
    allRotates.push(2);
    allColors.push('#00ff00');
    allFigures.push([0, 1, 0, 1, 1, 1]);
    allHeights.push(2);
    allWidths.push(3);
    allRotates.push(4);
    allColors.push('#9900cc');
    allFigures.push([1, 1, 0, 0, 1, 1]);
    allHeights.push(2);
    allWidths.push(3);
    allRotates.push(2);
    allColors.push('#ff0000');
    //drawing

    canvas.width = widthInBlocks * blockWidth;
    canvasBackground.width = widthInBlocks * blockWidth;
    canvas.height = heightInBlocks * blockWidth;
    canvasBackground.height = heightInBlocks * blockWidth;
    canvasBackground.style.top = '-' + (canvas.height + 7) + 'px';
    canvasNext.width = max([max(allHeights), max(allWidths)]) * blockWidth;
    canvasNext.height = max([max(allHeights), max(allWidths)]) * blockWidth;
    pauseDIV.style.width = (canvas.width - 20) + 'px';
    pauseDIV.style.top = '-' + (canvas.height / 2 + 400 + canvasNext.height + canvasBackground.height) + 'px';
    recordDIV.innerHTML = 'Record:&nbsp;' + record();
    canvasNext.style.left = (canvas.width + 6) + 'px';
    canvasNext.style.top = '-' + (canvas.height + 7 + canvasBackground.height) + 'px';
    var style = 'left: ' + (canvas.width + 2) + 'px; top: -' + (canvas.height + 7 + canvasBackground.height) + 'px; ' +
            'width: ' + (canvasNext.width + 6) + 'px;';
    var style2 = 'left: ' + (canvas.width + 2) + 'px; top: -' + (canvas.height + 160 + canvasBackground.height) + 'px; ' +
            'width: ' + (canvasNext.width + 6) + 'px;';
    pointsDIV.style.cssText = style;
    linesDIV.style.cssText = style;
    figuresDIV.style.cssText = style;
    recordDIV.style.cssText = style;
    restartDIV.style.cssText = style;
    nextDIV.style.cssText = style;
    pointsDIV2.style.cssText = style2;
    linesDIV2.style.cssText = style2;
    figuresDIV2.style.cssText = style2;
    recordDIV2.style.cssText = style2;
    gameDIV.style.width = (canvas.width + canvasNext.width + 8) + 'px';
    gameDIV.style.height = (canvas.height + 2) + 'px';

    setLimit();
    drawNext();

    if(!record()){
        document.cookie = 'record=0';
    }

    //alert
    function unpause(){
        pauseDIV.style.display = 'none';
        pauseDIV.innerHTML = 'GAME PAUSED<br/><span style="font-size: 70%;">PRESS SPACE TO PLAY</span>';
    }

    function start(){
        pauseDIV.innerHTML = 'PRESS <span style="font-size: 90%;">SPACE</span> TO START';
        pauseDIV.style.display = 'block';
    }

    function gameOverMessage(){
        var linesWord = 'line';
        if(lines != 1) linesWord = 'lines';
        var cookie = getCookie();
        var Record = 'Record: ' + record() + '.';
        if(indicator.record) {
            Record = 'Record: ' + record() + '. Congratulations! You just set new record!';
            indicator.record = 0;
        }
        pauseDIV.innerHTML = 'GAME OVER<br/><span style="font-size: 70%;">PRESS SPACE TO RESTART</span><div ' +
                'class="points">You\'ve scored ' + (lines * 100 + figures) + ' points.</div><div class="points">'+
                figures + ' figures fell.</div><div class="points">' + lines + ' ' + linesWord + ' disappered.</div>' +
                '<div class="points">' + Record + '</div><input id="submit" type="text" placeholder="Enter your name ' +
                'to submit your points"><div class="clear"><img src="clear.png"></div><div class="submitPoints" ' +
                'onclick="submitPoints();">Submit your points</div><div id="cookie"></div>';
        if(cookie){
            caption();
            findMaxCookie(cookie);
            writeDownStats(cookie);
        }
        pauseDIV.style.display = 'block';
        pauseDIV.style.top = '-' + (canvas.height + canvasBackground.height + canvasNext.height + 334) + 'px';
        id('cookie').style.maxHeight = (canvas.height - 360) + 'px';
    }
    //alert

    //events
    function Title(elem){
        if(elem == id('record')){
            if(elem.innerText.length > 13){
                titleDIV.style.left = event.pageX + 'px';
                titleDIV.style.top = event.pageY + 'px';
                titleDIV.innerHTML = elem.innerText.slice(elem.innerText.indexOf(':') + 2);
                titleDIV.style.display = 'block';
            }
        } else {
            if(elem.innerText.length > 14){
                titleDIV.style.left = event.pageX + 'px';
                titleDIV.style.top = event.pageY + 'px';
                titleDIV.innerHTML = elem.innerText.slice(elem.innerText.indexOf(':') + 2);
                titleDIV.style.display = 'block';
            }
        }

    }

    function onclickRestart(){
        restart();
        indicator.space = 0;
        pointsDIV.innerHTML = 'Points: 0';
        linesDIV.innerHTML = 'Lines: 0';
        figuresDIV.innerHTML = 'Figures: 0';
        start();
    }

    function restart(){
        stop(timerId);
        stop(timerId2);
        stop(timerId3);
        setLimit();
        Delete(canvas);
        Delete(canvasBackground);
        unpause();
        y = Y;
        x = X;
        color = [];
        figures = 0;
        lines = 0;
    }

    function keyDown(event){
        event = event || window.event;
        if(!gameOver()){
            if(indicator.space == 1 || indicator.space == 3) {
                switch (event.keyCode){
                    case 37:
                        if(indicator.left) move('left');
                        indicator.left = 0;
                        break;
                    case 39:
                        if(indicator.right) move('right');
                        indicator.right = 0;
                        break;
                    case 38:
                        if(indicator.up) rotate();
                        indicator.up = 0;
                        break;
                    case 40:
                        if(indicator.down) speedV /= increase;
                        indicator.down = 0;
                        break;
                }
            }
            if(event.keyCode == 32){
                if(indicator.space < 2){
                    if(indicator.space) {
                        stop(timerId2);
                        pauseDIV.style.display = 'block';
                        indicator.space = 2;
                    } else {
                        cubeDown();
                        unpause();
                        indicator.space = 3;
                    }
                }
            }
            if(event.keyCode == 82 && indicator.r){
                restart();
                indicator.space = 0;
                indicator.r = 0;
                pointsDIV.innerHTML = 'Points: 0';
                linesDIV.innerHTML = 'Lines: 0';
                figuresDIV.innerHTML = 'Figures: 0';
                start();
            }
        } else {
            if(event.keyCode == 32 || event.keyCode == 82){
                restart();
                cubeDown();
            }
        }
    }

    function keyUp(event){
        event = event || window.event;
        if(indicator.space == 1 || indicator.space == 3) {
            switch (event.keyCode){
                case 37:
                    indicator.left = 1;
                    stop(timerId);
                    break;
                case 38:
                    indicator.up = 1;
                    stop(timerId3);
                    break;
                case 39:
                    indicator.right = 1;
                    stop(timerId);
                    break;
                case 40:
                    indicator.down = 1;
                    speedV *= increase;
                    break;
            }
        }
        if(event.keyCode == 32){
            if(indicator.space == 2){
                indicator.space = 0;
            } else {
                indicator.space = 1;
            }
        }
        if(event.keyCode == 82){
            indicator.r = 1;
        }
    }
    //events

    //limits
    function setLimit(){
        for(var i = 0; i < (heightInBlocks + 1) * (widthInBlocks + 2); i++){

            if((i % (widthInBlocks + 2) == 0) || ((i - (widthInBlocks + 1)) % (widthInBlocks + 2) == 0) || (i >
                    (heightInBlocks + 1) * (widthInBlocks + 2) - widthInBlocks - 3)) {
                limit[i] = 1;
            } else {
                limit[i] = 0;
            }
        }
    }

    function limitV(){
        for(var i = 0; i < position.length; i++) {
            if(position[i] != 'null' && (limit[position[i] + (widthInBlocks + 2)] == 1)) return 1;
        }
        return 0;
    }

    function limitR(){
        for(var i = 0; i < position.length; i++) {
            if(position[i] != 'null' && (limit[position[i] + 1] == 1)) return 1;
        }
        return 0;
    }

    function limitL(){
        for(var i = 0; i < position.length; i++) {
            if(position[i] != 'null' && (limit[position[i] - 1] == 1)) return 1;
        }
        return 0;
    }

    function newLimits() {
        for(var i = 0; i < position.length; i++) {
            if(position[i] != 'null') {
                limit[position[i]] = 1;
                color[position[i]] = figColor;
            }
        }
    }
    //limits

    //helping functions
    function max(numarr){
        var max = numarr[0];
        for(var i = 1; i < numarr.length; i++){
            if(numarr[i] > max) max = numarr[i];
        }
        return max;
    }

    function stop(context) {
        if(context != undefined) clearTimeout(context);
    }

    function Delete(context){
        context.width = context.width;
    }

    function gameOver(){
        for(var i = ((widthInBlocks + 2) * 2 + 1); i < ((widthInBlocks + 2) * 3 - 1); i++) {
            if(limit[i] == 1) return 1;
        }
        return 0;
    }

    function id(id){
        return document.getElementById(id);
    }

    function copyArr(arr){
        var result = [];
        for(var i = 0; i < arr.length; i++){
            result[i] = arr[i];
        }
        return result;
    }

    function record(){
        if(document.cookie.indexOf('record=') != -1){
            if(document.cookie.indexOf(';') != -1){
                return document.cookie.slice(document.cookie.indexOf('record=') + 7, document.cookie.indexOf(';',
                document.cookie.indexOf('record=')));
            }
            return document.cookie.slice(document.cookie.indexOf('record=') + 7);
        }
        return 0;
    }
    //helping functions

    //drawing
    function drawNext(){
        Delete(canvasNext);
        var current = Math.floor(next * allFigures.length);
        var figure = copyArr(allFigures[current]);
        var height = allHeights[current];
        var width = allWidths[current];
        var color = allColors[current];
        for(var i = 0; i < height * width; i++){
            if(figure[i]) drawBlock(tetrisNext, color, (i % width) * blockWidth, Math.floor(i / width) * blockWidth);
        }
    }

    function drawBlock(context, color, x, y){
        context.fillStyle = color;
        context.fillRect(x, y, blockWidth, blockWidth);
        context.strokeStyle = '#ffffff';
        context.strokeRect(x + 0.5, y + 0.5, blockWidth - 0.5, blockWidth - 0.5);
    }

    function draw(context){
        getInformation();
        drawFig(context, allColors[Math.floor(random * allFigures.length)]);
    }

    function getInformation(){
        var current = Math.floor(random * allFigures.length);
        figure = copyArr(allFigures[current]);
        height = allHeights[current];
        width = allWidths[current];
        for(var i = 0; i < rotateIndex % allRotates[current]; i++){
            rotateFig();
        }
    }

    function drawFig(context, color){
        figColor = color;
        for(var i = 0; i < height * width; i++){
            if(figure[i]) drawBlock(context, color, x + (i % width) * blockWidth, y + Math.floor(i / width) * blockWidth);
        }
    }

    function rotateFig(){
        var figureCopy = copyArr(figure);
        var i = 0;
        var j = 0;
        while(i < height * width){
            for(var k = 0; k < height; k++){
                figure[i] = figureCopy[width - 1 - j + width * k];
                i++;
            }
            j++;
        }
        var heightCopy = height;
        height = width;
        width = heightCopy;
    }
    //drawing

    //moving
    function cubeDown(){

        if(gameOver()) {
            gameOverMessage();
            return;
        }
        if(figures == 0) {
            figures++;
            pointsDIV.innerHTML = 'Points:&nbsp;' + figures;
            figuresDIV.innerHTML = 'Figures:&nbsp;' + figures;
            if(record() < figures){
                document.cookie = 'record=' + figures;
                recordDIV.innerHTML = 'Record:&nbsp;' + figures;
                indicator.record = 1;
            }
            next = Math.random();
            drawNext();
        }
        Delete(canvas);
        draw(tetris);
        findPosition();
        if(y % blockWidth == 0){
            if(limitV()){
                draw(tetrisBackground);
                newLimits();
                deleteRow();
                x = X;
                y = Y;
                rotateIndex = 0;
                random = next;
                next = Math.random();
                drawNext();
                cubeDown();
                if(!gameOver()) {
                    figures++;
                    pointsDIV.innerHTML = 'Points:&nbsp;' + (lines * 100 + figures);
                    figuresDIV.innerHTML = 'Figures:&nbsp;' + figures;
                    linesDIV.innerHTML = 'Lines:&nbsp;' + lines;
                    if(record() < (lines * 100 + figures)){
                        document.cookie = 'record=' + (lines * 100 + figures);
                        recordDIV.innerHTML = 'Record:&nbsp;' + (lines * 100 + figures);
                        indicator.record = 1;
                    }
                }
                return;
            }
        }

        y += 2;
        timerId2 = setTimeout(cubeDown, speedV);
    }

    function move(dir){
        stop(timerId);
        moveTimer();
        function moveTimer(){

            if(gameOver()) return;

            findPosition();

            if(limitL() && dir == 'left') {
                timerId = setTimeout(moveTimer, speedV / 2);
                return;
            }
            if(limitR() && dir == 'right') {
                timerId = setTimeout(moveTimer, speedV / 2);
                return;
            }


            if(dir == 'left') {
                x -= blockWidth;

            }
            if(dir == 'right') {
                x += blockWidth;

            }

            Delete(canvas);
            draw(tetris);

            timerId = setTimeout(moveTimer, speedH);
        }

    }

    function rotate(){
        if(gameOver()) return;
        stop(timerId3);
        rotateIndex++;
        getInformation();
        try{
            findPosition();
            if(findError()) rotateIndex--;
        } catch (e) {
            rotateIndex--;
        }
        Delete(canvas);
        draw(tetris);
        timerId3 = setTimeout(rotate, rotateSpeed);
    }

    function findError(){
        for(var i = 0; i < position.length; i++){
            if(position[i] != 'null' && limit[position[i]] == 1) return 1;
        }
        return 0;
    }
    //moving

    //statistics
    function submitPoints(){
        var newDate = new Date();
        if(newDate.getDate() < 10) {
            var date = '0' + newDate.getDate();
        } else {
            date = newDate.getDate();
        }
        if(newDate.getMonth() < 9) {
            var month = '0' + (newDate.getMonth() + 1);
        } else {
            month = newDate.getDate() + 1;
        }
        if(newDate.getHours() < 10) {
            var hours = '0' + newDate.getHours();
        } else {
            hours = newDate.getHours();
        }
        if(newDate.getMinutes() < 10) {
            var minutes = '0' + newDate.getMinutes();
        } else {
            minutes = newDate.getMinutes();
        }
        if(newDate.getSeconds() < 10) {
            var seconds = '0' + newDate.getSeconds();
        } else {
            seconds = newDate.getSeconds();
        }
        document.cookie = id('submit').value + '-' + date + '.' + month + '.' +
                newDate.getFullYear() + '.' + hours + '.' + minutes + '.' + seconds + '=' + (lines * 100 + figures);
        var cookie = getCookie();
        caption();
        findMaxCookie(cookie);
        writeDownStats(cookie);
    }

    function getCookie(){
        var cookie = document.cookie.split('; ');
        cookie.splice(cookie.indexOf('record=' + record()), 1);
        if(!cookie[1]) return 0;
        var name = [];
        var value = [];
        var date = [];
        var result = [];
        for(var i = 0; i < cookie.length; i++){
                name[i] = cookie[i].slice(0, cookie[i].lastIndexOf('-'));
                value[i] = cookie[i].slice(cookie[i].lastIndexOf('=') + 1);
                date[i] = cookie[i].slice(cookie[i].lastIndexOf('-') + 1, cookie[i].lastIndexOf('=')).split('.');
                result.push(name[i], value[i], date[i]);
        }
        return result;
    }

    //sort
    function sortByPoints(){
        var cookie = getCookie();
        caption();
        if(indicator.points){
            indicator.points = 0;
            CSS.innerHTML = '.cookie td:first-of-type + td{ background: url(up.png) no-repeat 50% 0%;}';
            findMinCookie(cookie);
        } else {
            indicator.points = 1;
            CSS.innerHTML = '.cookie td:first-of-type + td{ background: url(down.png) no-repeat 50% 0%;}';
            findMaxCookie(cookie);
        }
        writeDownStats(cookie);
    }

    function sortByName(){
        var cookie = getCookie();
        caption();
        if(indicator.name){
            indicator.name = 0;
            CSS.innerHTML = '.cookie td:first-of-type { background: url(up.png) no-repeat 50% 0%;}';
            findMinCookieStr(cookie);
        } else {
            indicator.name = 1;
            CSS.innerHTML = '.cookie td:first-of-type { background: url(down.png) no-repeat 50% 0%;}';
            findMaxCookieStr(cookie);
        }
        writeDownStats(cookie);
    }

    function sortByTime(){
        var cookie = getCookie();
        caption();
        if(indicator.time){
            indicator.time = 0;
            CSS.innerHTML = '.cookie td:first-of-type + td + td { background: url(up.png) no-repeat 50% 0%;}';
            findMinCookieTime(getMilliseconds(cookie), cookie);
        } else {
            indicator.time = 1;
            CSS.innerHTML = '.cookie td:first-of-type + td + td { background: url(down.png) no-repeat 50% 0%;}';
            findMaxCookieTime(getMilliseconds(cookie), cookie);
        }
        writeDownStats(cookie);
    }
    //sort

    //max/min
    function findMaxCookie(arr){
        for(var k = 0; k < arr.length / 3 - 1; k++){
            for(var j = 0; j < arr.length - 1 - k * 3; j += 3){
                if(+arr[j + 1] < +arr[j + 4]){
                    replace(arr, j);
                }
            }
        }
    }


    function findMinCookie(arr){
        for(var k = 0; k < arr.length / 3 - 1; k++){
            for(var j = 0; j < arr.length - 1 - k * 3; j += 3){
                if(+arr[j + 1] > +arr[j + 4]){
                    replace(arr, j);
                }
            }
        }
    }

    function findMinCookieTime(arr, arr2){
        for(var k = 0; k < arr.length / 3 - 1; k++){
            for(var j = 0; j < arr.length - 1 - k * 3; j += 3){
                if(arr[j] > arr[j + 1]){
                    replace(arr2, j);
                }
            }
        }
    }

    function findMaxCookieTime(arr, arr2){
        for(var k = 0; k < arr.length / 3 - 1; k++){
            for(var j = 0; j < arr.length - 1 - k * 3; j += 3){
                if(arr[j] < arr[j + 1]){
                    replace(arr2, j);
                }
            }
        }
    }

    function findMaxCookieStr(arr){
        for(var k = 0; k < arr.length / 3 - 1; k++){
            for(var j = 0; j < arr.length - 1 - k * 3; j += 3){
                if(arr[j] < arr[j + 3]){
                    replace(arr, j);
                }
            }
        }
    }

    function findMinCookieStr(arr){
        for(var k = 0; k < arr.length / 3 - 1; k++){
            for(var j = 0; j < arr.length - 1 - k * 3; j += 3){
                if(arr[j] > arr[j + 3]){
                    replace(arr, j);
                }
            }
        }
    }
    //max/min

    function writeDownStats(arr){
        for(var i = 0; i < arr.length; i += 3){
            var newDate = new Date();
            if(newDate.getDate() == arr[i + 2][0] && newDate.getMonth() + 1 == arr[i + 2][1] &&
                    newDate.getFullYear() == arr[i + 2][2]){
                var date = arr[i + 2][3] + ':' + arr[i + 2][4];
            } else {
                date = arr[i + 2][0] + '.' + arr[i + 2][1] + '.' + arr[i + 2][2];
            }

            id('cookie').innerHTML += '<table class="cookieBody' + (i % 2) + '"><tbody><tr>' +
                    '<td>' + arr[i] + '</td><td>' + arr[i + 1] + '</td><td>' + date + '</td></tr></tbody>' +
                    '</table>';
        }
    }

    function caption(){
        id('cookie').innerHTML = '<table class="cookie"><tbody><tr><td onclick="sortByName();">' +
                'Name</td><td onclick="sortByPoints();">Points</td><td onclick="sortByTime();">Time</td></tr></tbody>' +
                '</table>';
    }

    function replace(arr, i){
        var cookieCopy = [arr[i], arr[i + 1], arr[i + 2]];
        arr[i] = arr[i + 3];
        arr[i + 1] = arr[i + 4];
        arr[i + 2] = arr[i + 5];
        arr[i + 3] = cookieCopy[0];
        arr[i + 4] = cookieCopy[1];
        arr[i + 5] = cookieCopy[2];
    }

    function getMilliseconds(arr){
        var result = [];
        for(var i = 0; i < arr.length / 3; i++){
            result[i] = (+new Date(+arr[i * 3 + 2][2], +arr[i * 3 + 2][1] - 1, +arr[i * 3 + 2][0], +arr[i * 3 + 2][3],
                    +arr[i * 3 + 2][4], +arr[i * 3 + 2][5]));
        }
        return result;
    }
    //statistics

    function deleteRow(){

        for(var i = limit.length / (widthInBlocks + 2) - 1; i > 0; i--){

            for(var j = i * (widthInBlocks + 2) - 2; j > (i - 1) * (widthInBlocks + 2); j--) {
                if(limit[j] != 1) break;
            }

            if(j == (i - 1) * (widthInBlocks + 2)){

                lines += 1;
                var newLimit = [];
                var newColor = [];

                for(var k = 0; k < (i - 1) * (widthInBlocks + 2); k++){
                    var l = k + widthInBlocks + 2;
                    newLimit[l] = limit[k];
                    newColor[l] = color[k];
                }

                newLimit[0] = 1;
                newLimit[widthInBlocks + 1] = 1;

                for(var m = 0; m < i * (widthInBlocks + 2); m++){
                    limit[m] = newLimit[m];
                    color[m] = newColor[m];
                }

                tetrisBackground.clearRect(0, 0, widthInBlocks * blockWidth, blockWidth * i);

                for(var n = 0; n < limit.length; n++){
                    if(limit[n] == 1 && color[n]) {
                        drawBlock(tetrisBackground, color[n], (n % (widthInBlocks + 2) - 1) * blockWidth, Math.floor(n / (widthInBlocks + 2)) * blockWidth);
                    }
                }
                i++;
            }
        }
    }

    function findPosition(){
        var heightInFig = 0;
        var spacingFromStart = 0;
        for(var i = 0; i < max([width * height, position.length]); i++) {
            if(i < width * height * 2){
                if(spacingFromStart % width == 0) spacingFromStart -= width * (spacingFromStart / width);
                if(i < figure.length){
                    if(figure[i]) {
                        position[i] = Math.floor(y / blockWidth) * (widthInBlocks + 2) + x / blockWidth + 1 +
                                spacingFromStart + heightInFig * (widthInBlocks + 2);
                        position[i + width * height] = Math.ceil(y / blockWidth) * (widthInBlocks + 2) + x /
                                blockWidth + 1 + spacingFromStart + heightInFig * (widthInBlocks + 2);
                    } else {
                        position[i] = 'null';
                        position[i + width * height] = 'null';
                    }
                    if(spacingFromStart == width - 1) heightInFig++;
                    spacingFromStart++;
                }
            } else {
                position[i] = 'null';
            }
        }
    }