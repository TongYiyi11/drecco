var canvas;
var width = 0;
var height = 0;
var is_draw = false;
var draw_test_flag = false;
var draw_select_flag = false;
var draw_next_flag = false;

var inGame = false;
var bag_num_total = 0;
var bag_num1 = 0;
var bag_num2 = 0;
var bag_arr;
var flares = 0;
var input_arr;
var bad_flares = 0;
var score = 0;
var current_player;

var done = false;
var game;

let bag_img;
function preload() {
  bag_img = loadImage('assets/bag.png');
}

function setup() {
  width = document.getElementById('game-container').offsetWidth - 100;
  containerHeight = window.innerHeight;
  height = width * 3 / 4 - width / 6;
  canvas = createCanvas(width, Math.max(height, containerHeight * 3 / 4)); // ~4:3 aspect ratio
  canvas.parent('game-container');
}

function draw() {
  background(220);
  fill(255);
  if (inGame) {
    drawBags(120, 20, 40, 15);
    drawInputs(120, 20, 40, 15);
    drawButtons();   
    drawResultFrame();
    drawTestResult();
    drawSelectResult();
    drawNextResult();
    drawFinalResult();
  }
}

function startGame() {
    // alert("in");
    inGame = true;
    is_draw = false;
    bag_num1 = parseInt(document.getElementById("bag-num-type1").value);
    bag_num2 = parseInt(document.getElementById("bag-num-type2").value);
    bag_num_total = bag_num1 + bag_num2;
    flares = parseInt(document.getElementById("number-of-flares").value);
    bag_arr = Array(bag_num_total).fill(flares);
    input_arr = Array(bag_num_total).fill(0);
    draw_test_flag = false;
    draw_select_flag = false;

    player1 = document.getElementById("player-1").value;
    player2 = document.getElementById("player-2").value;
    numFlares = parseInt(document.getElementById("number-of-flares").value);
    numBags1 = parseInt(document.getElementById("bag-num-type1").value);
    numBags2 = parseInt(document.getElementById("bag-num-type2").value);
    percentBad1 = parseInt(document.getElementById("bag-percent-type1").value);
    percentBad2 = parseInt(document.getElementById("bag-percent-type2").value);
    // alert("done");
    game = new Game({
        player1: player1,
        player2: player2,
        numFlares: numFlares,
        numBags1: numBags1,
        numBags2: numBags2,
        percentBad1: percentBad1,
        percentBad2: percentBad2,
        time: 120
    });
    done = false;
}

function drawBags(img_size, pad_size_h, pad_size_v, offset_h) {
  offset = 10;
  for(let i = 0; i < bag_num_total; i++){
    row = Math.floor(i / 5);
    col = i % 5;
    x = pad_size_h * (col + 1) + img_size * col + offset_h;
    y = pad_size_v * (row + 1) + img_size * row;
    // draw image
    image(bag_img, x, y, img_size, img_size);
    // draw text
    stroke(50);
    fill(50);
    strokeWeight(1);
    textSize(16);
    var bag = game.bags[i];
    text(bag.badFlares + bag.goodFlares, x + 3, y + 12);
  }
}

function drawInputs(img_size, pad_size_h, pad_size_v, offset_h){
  if(!is_draw){
    is_draw = true;
    for(let i = 0; i < bag_num_total; i++){
      row = Math.floor(i / 5);
      col = i % 5;
      x = pad_size_h * (col + 1) + img_size * col + offset_h;
      y = pad_size_v * (row + 1) + img_size * row;
      // draw input
      input = createInput('0');
      input.parent('game-container');
      input.position(x + 11, y + img_size + 5);
      input.size(img_size);
      input_arr[i] = input;
    }
  }
}

function drawButtons(){
  x_start = width / 4 - 80;
  y_start = height * 4 / 5 + 10;
  x_interval = 100;

  button = createButton('Test');
  button.position(x_start, y_start);
  button.parent('game-container');
  button.attribute('class', 'btn')
  button.style('background-color', '#7cb5e9');
  button.style('color', 'white');
  button.size(80);
  button.mousePressed(updateTestResult);

  button = createButton('Select');
  button.position(x_start + x_interval, y_start);
  button.parent('game-container');
  button.attribute('class', 'btn')
  button.style('background-color', '#FF6A6A');
  button.style('color', 'white');
  button.size(80);
  button.mousePressed(updateSelectResult);

  button = createButton('Next');
  button.position(x_start + x_interval * 2, y_start);
  button.parent('game-container');
  button.attribute('class', 'btn')
  button.style('background-color', '#8470FF');
  button.style('color', 'white');
  button.size(80);
  button.mousePressed(updateNextResult);
}

function drawResultFrame(){
  let c = color(255, 215, 0, 90);
  fill(c);
  noStroke();
  rect(width / 3 + 170, height * 4 / 5 - 10, 300, 100, 20);
}

// return test_res: bag index, test number
function updateTestResult(){
  var test_res = [];
  for(let i = 0; i < bag_num_total; i++){
    val = parseInt(input_arr[i].value());
    if(val != 0){
      test_res[0] = i;
      test_res[1] = val;
      break;
    }
  }
  // alert(test_res[0]);
  var bad = game.testFlares(test_res[0], test_res[1]);
  bad_flares = bad[0];
  if (bad_flares != -1) {
    draw_test_flag = true;
    draw_select_flag = false;
    draw_next_flag = false;
    drawTestResult();
  }
}

// return select_res: array of select number
function updateSelectResult(){
  draw_select_flag = true;
  draw_test_flag = false;
  draw_next_flag = false;
  var select_res = [];
  for(let i = 0; i < bag_num_total; i++){
    select_res[i] = parseInt(input_arr[i].value());
  }

  score = game.selectFlares(select_res);
  drawSelectResult();
}

function updateNextResult(){
  draw_select_flag = false;
  draw_test_flag = false;
  draw_next_flag = true;
  takeTurn();
  for(let i = 0; i < bag_num_total; i++){
    input_arr[i].value('0');
  }
}

function drawTestResult(){
  if(draw_test_flag){
    stroke('#7cb5e9');
    fill('#7cb5e9');
    strokeWeight(1);
    textSize(16);
    text('Test Result: ', width / 3 + 200, height * 4 / 5 + 20);
    text(bad_flares + ' Bad Flares!', width / 3 + 250, height * 4 / 5 + 60)
  }
}

function drawSelectResult(){
  if(draw_select_flag && !game.gameOver){
    player = game.players[game.currentTurn].name;
    stroke('#FF6A6A');
    fill('#FF6A6A');
    strokeWeight(1);
    textSize(16);
    text('Select Result: ', width / 3 + 200, height * 4 / 5 + 20);
    text(player + ' Win ' + score + ' Scores!', width / 3 + 230, height * 4 / 5 + 60)
  }
}

// input: current player's name
function drawNextResult(){
  if(draw_next_flag){
    stroke('#8470FF');
    fill('#8470FF');
    strokeWeight(1);
    textSize(18);
    text(current_player + '\'s Turn!', width / 3 + 250, height * 4 / 5 + 50);
  }
}

function drawFinalResult(){
  if(game.gameOver){
    stroke(150);
    fill(150);
    strokeWeight(1);
    textSize(18);
    p1 = game.players[0];
    p2 = game.players[1];
    winner = p1.finalScore > p2.finalScore ? p1 : p2;
    res = p1.name + ": " + p1.finalScore + " vs " + p2.name + ": " + p2.finalScore;
    text(res, width / 3 + 190, height * 4 / 5 + 30);
    text(winner.name + " Wins!", width / 3 + 250, height * 4 / 5 + 60);
  }
}

function takeTurn() {
    if (done) return;
    if (game.gameOver) {
        //gameOver();
        done = true;
        return;
    }
    current_player = game.takeTurn();
}

function gameOver() {
    $.get('https://cims.nyu.edu/~as9913/drecco/games/NoTipping/saveScore.php', {
        score: game.players[turn].name,
        gamename: 'NoTipping',
        playername: game.players[0].name + ' vs ' + game.players[1].name
    }).done(function(data) { 
        console.log("Saved success");
        console.log(data);
    }).fail(function(data) {
        console.log("Saved failure");
        console.log(data);
    });
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

/*
 * Object for the respective player. Contains the following information:
 *
 * - name: Name of the player
 * - timeLeft: Amount of time player has left (unnecessary(?))
 */
class Player {
    constructor(name, timeLeft) {
        this.name = name;
        this.timeLeft = timeLeft;
        this.end = false;
        this.finalScore = 0;
    }
}

class Bag {
    constructor(num, percent) {
        this.badFlares = num * percent / 10;
        this.goodFlares = num - this.badFlares;
    }

    testFlare() {
        var randVal = Math.floor(Math.random() * (this.badFlares+this.goodFlares));
        //alert(randVal);
        if (randVal < this.badFlares) {
            --this.badFlares;
            return 1;
        } else {
            --this.goodFlares;
            return 0;
        }
    }
}

class Game {
    /*
     * Properties is an object containing all necessary information for game.
     *
     * - player1: Gives the name for player 1.
     * - player2: Gives the name for player 2.
     * - time: Amount of time that each player has
     */
    constructor(properties) {
        this.numFlares = properties.numFlares;
        this.numBags1 = properties.numBags1;
        this.numBags2 = properties.numBags2;
        this.percentBad1 = properties.percentBad1;
        this.percentBad2 = properties.percentBad2;
        this.totalTime = properties.time;
        this.gameOver = false;
        this.currentTurn = 0;

        this.players = new Array(2);
        this.players[0] = new Player(properties.player1, this.totalTime);
        this.players[1] = new Player(properties.player2, this.totalTime);

        var n = this.numBags1 + this.numBags2;
        this.bags = new Array(n);
        for (let i = 0; i < this.numBags1; ++i) {
            this.bags[i] = new Bag(this.numFlares, this.percentBad1);
        }
        for (let i = this.numBags1; i < n; ++i) {
            this.bags[i] = new Bag(this.numFlares, this.percentBad2);
        }
        shuffle(this.bags);
    }

    takeTurn() {
        this.currentTurn ^= 1;
        if (this.players[this.currentTurn].end == true) {
            this.currentTurn ^= 1;
        }
        return this.players[this.currentTurn].name;
    }

    testFlares(i, k, s=false) {
        var bag = this.bags[i];
        var n = bag.badFlares + bag.goodFlares;
        if (!s && n == 0) {
            alert("This bag is empty! Choose another one.");
            return [-1,-1];
        } else if (!s && k > this.numFlares/20) {
            alert("Cannot test more than 5% of flares per bag!");
            return [-1,-1];
        }
        n = Math.min(k, n);
        var res = 0;
        for (let j = 0; j < n; ++j) {
              res += bag.testFlare();
        }
        return [res, n-res];
    }

    selectFlares(a) {
        var score = 0;
        for (let i = 0; i < this.bags.length; ++i) {
            var nums = this.testFlares(i, a[i], true);
            score -= nums[0] * 1000;
            score += nums[1] * 100;
        }
        this.players[this.currentTurn].end = true;
        this.players[this.currentTurn].finalScore = score;
        if (this.players[this.currentTurn^1].end) {
          this.gameOver = true;
        }
        return score;
    }

    /*
     * Update the player's time based on the amount of time that they took.
     * (May be unnecessary for 2-player games)
     */
    updateTime(turn, time) {
        this.players[this.currentTurn].timeLeft -= time;

        if(this.players[this.currentTurn].timeLeft <= 0) {
            this.gameOver = true;
            return this.players[this.currentTurn].name + ' ran out of time';
        } else {
            return this.players[this.currentTurn].name + ' has ' + this.players[this.currentTurn].timeLeft + ' time left.';
        }
    }
}
