var canvas;
var width = 0;
var height = 0;
var is_draw = false;
var draw_test_flag = false;
var draw_select_flag = false;
var draw_end_flag = false;

var inGame = false;
var bag_num_total = 0;
// var bag_num1 = 0;
// var bag_num2 = 0;
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
  width = 900;
  height = 400;
  canvas = createCanvas(width, Math.max(height, containerHeight * 3 / 4)); // ~4:3 aspect ratio
  canvas.parent('game-container');
}

function draw() {
  background(220);
  fill(255);
  R = 180;
  center_x = width / 2 - 160;
  center_y = height / 2 - 50;
  image_size = 80;
  if (inGame) {
    drawBags(image_size, R, center_x, center_y);
    drawInputs(image_size, R, center_x, center_y);
    drawButtons(center_x + 10, center_y + 30);   
    drawTextFrame();
    drawTestResult();
    drawSelectResult();
    drawEndResult();
    drawFinalResult();
    drawRules();
    drawTurn();
  }
}

function startGame() { 
    removeElements(); 
    inGame = true;
    is_draw = false;
    player1 = document.getElementById("player-1").value;
    player2 = document.getElementById("player-2").value;
    numFlares = parseInt(document.getElementById("number-of-flares").value);
    numBags1 = parseInt(document.getElementById("bag-num-type1").value);
    numBags2 = parseInt(document.getElementById("bag-num-type2").value);
    bag_num_total = numBags1 + numBags2;
    percentBad1 = parseInt(document.getElementById("bag-percent-type1").value);
    percentBad2 = parseInt(document.getElementById("bag-percent-type2").value);
    flares = parseInt(document.getElementById("number-of-flares").value);
    bag_arr = Array(bag_num_total).fill(flares);
    input_arr = Array(bag_num_total).fill(0);
    draw_test_flag = false;
    draw_select_flag = false;
    
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

function drawBags(img_size, R, center_x, center_y) {
  rad = 2 * Math.PI / bag_num_total;
  for(let i = 0; i < bag_num_total; i++){
    x = center_x + R * Math.cos(rad * i);
    y = center_y + R * Math.sin(rad * i);
    // draw image
    image(bag_img, x, y, img_size, img_size);
    // draw text
    stroke(100);
    fill(100);
    strokeWeight(1);
    textSize(14);
    var bag = game.bags[i];
    text(bag.badFlares + bag.goodFlares, x - 5, y + 12);
  }
}

function drawInputs(img_size, R, center_x, center_y){
  if(!is_draw){
    is_draw = true;
    rad = 2 * Math.PI / bag_num_total;
    for(let i = 0; i < bag_num_total; i++){
      x = center_x + R * Math.cos(rad * i);
      y = center_y + R * Math.sin(rad * i);
      // draw input
      input = createInput('0');
      input.parent('game-container');
      input.position(x + 11, y + img_size);
      input.size(img_size);
      input.style('font-size', '10px');
      input_arr[i] = input;
    }
  }
}

function drawButtons(center_x, center_y){
  button = createButton('Test');
  button.position(center_x, center_y - 50);
  button.parent('game-container');
  button.attribute('class', 'btn')
  button.style('background-color', '#7cb5e9');
  button.style('color', 'white');
  button.size(80);
  button.mousePressed(updateTestResult);

  button = createButton('Select');
  button.position(center_x, center_y);
  button.parent('game-container');
  button.attribute('class', 'btn')
  button.style('background-color', '#FF6A6A');
  button.style('color', 'white');
  button.size(80);
  button.mousePressed(updateSelectResult);

  button = createButton('End');
  button.position(center_x, center_y + 50);
  button.parent('game-container');
  button.attribute('class', 'btn')
  button.style('background-color', '#8470FF');
  button.style('color', 'white');
  button.size(80);
  button.mousePressed(updateEndResult);
}

function drawTextFrame(){
  // frame for results
  let c = color(255, 215, 0, 50);
  fill(c);
  noStroke();
  rect(width / 3 + 250, height * 4 / 5 - 10, 300, 100, 20);

  // frame for rules
  c = color(240, 255, 255, 80);
  fill(c);
  noStroke();
  rect(width / 3 + 300, height * 1 / 5 - 20, 240, 280, 20);

  // frame for total scores
  c = color(132, 112, 255, 50);
  fill(c);
  noStroke();
  temp_x = width / 3 + 250;
  temp_y = height * 1 / 5 - 90;
  rect(temp_x, temp_y, 300, 60, 20);
  // total scores
  c = color(255, 106, 106, 150);
  stroke(c);
  fill(c);
  strokeWeight(1);
  textSize(16);
  textLeading(25);
  p1 = game.players[0];
  p2 = game.players[1];
  res = p1.name + ": " + p1.finalScore + " vs " + p2.name + ": " + p2.finalScore;
  text('Total Scores: \n' + '  ' + res, temp_x + 20, temp_y + 20);
}

function restore_input(){
  for(let i = 0; i < bag_num_total; i++){
    input_arr[i].value('0');
  }
}

// return test_res: bag index, test number
function updateTestResult(){
  var test_res = [0,0];
  flag = false;
  for(let i = 0; i < bag_num_total; i++){
    val = parseInt(input_arr[i].value());
    if(isNaN(val) || val < 0){
      alert('Invalid input!');
      restore_input();
      return;
    }
    if(val != 0){
      if(flag){
        alert('Invalid input!');
        restore_input();
        return;
      }
      flag = true;
      test_res[0] = i;
      test_res[1] = val;
    }
  }
  // alert(test_res[0]);
  var bad = game.testFlares(test_res[0], test_res[1]);
  temp = bad[0];
  if (temp != -1) {
    bad_flares = temp;
    draw_test_flag = true;
    draw_select_flag = false;
    draw_end_flag = false;
    drawTestResult();
    takeTurn();
  }
  restore_input();
}

// return select_res: array of select number
function updateSelectResult(){
  var select_res = [];
  for(let i = 0; i < bag_num_total; i++){
    val = parseInt(input_arr[i].value());
    if(isNaN(val) || val < 0){
      alert('Invalid input!');
      restore_input();
      return;
    }
    select_res[i] = val;
  }
  temp = game.selectFlares(select_res);
  if(temp != -1){
    score = temp;
    draw_select_flag = true;
    draw_test_flag = false;
    draw_end_flag = false;
    drawSelectResult();
    takeTurn();
  }
  restore_input();
}

function updateEndResult(){
  draw_select_flag = false;
  draw_test_flag = false;
  draw_end_flag = true;
  game.endCurrent();
  takeTurn();
  restore_input();
}

function drawTurn(){
  stroke(100);
  fill(100);
  strokeWeight(1);
  textSize(16);
  player = game.players[game.currentTurn].name;
  text(player + '\'s turn', 30, 30);
}

function drawTestResult(){
  if(draw_test_flag){
    stroke('#7cb5e9');
    fill('#7cb5e9');
    strokeWeight(1);
    textSize(16);
    text('Test Result for ' + current_player + ': ', width / 3 + 270, height * 4 / 5 + 20);
    text(bad_flares + ' Bad Flare(s)!', width / 3 + 320, height * 4 / 5 + 60);
  }
}


function drawSelectResult(){
  if(draw_select_flag && !game.gameOver){
    stroke('#FF6A6A');
    fill('#FF6A6A');
    strokeWeight(1);
    textSize(16);
    text('Select Result for ' + current_player + ': ', width / 3 + 270, height * 4 / 5 + 20);
    if(score >= 0){
      text(current_player + ' wins ' + score + " points!", width / 3 + 300, height * 4 / 5 + 60);
    }else{
      text(current_player + ' loses ' + -score + " points!", width / 3 + 300, height * 4 / 5 + 60);
    }
  }

}

// input: current player's name
function drawEndResult(){
  if(draw_end_flag && !game.gameOver){
    stroke('#8470FF');
    fill('#8470FF');
    strokeWeight(1);
    textSize(16);
    text(current_player + ' stops his/her operations!', width / 3 + 270, height * 4 / 5 + 50);
  }
}

function drawFinalResult(){
  if(game.gameOver){
    stroke('#8470FF');
    fill('#8470FF');
    strokeWeight(1);
    textSize(16);
    p1 = game.players[0];
    p2 = game.players[1];
    text('Final Result: ', width / 3 + 270, height * 4 / 5 + 30);
    if(p1.finalScore == p2.finalScore){
      text(" Two Players Tied!", width / 3 + 320, height * 4 / 5 + 60);
    }else{
      winner = p1.finalScore > p2.finalScore ? p1 : p2;
      text(winner.name + " Wins!", width / 3 + 320, height * 4 / 5 + 60);
    }
  }
}

function drawRules(){
  stroke(100);
  fill(100);
  x = width / 3 + 300;
  y = height * 1 / 5 - 20;
  strokeWeight(1);
  textSize(18);
  text('Rules', x + 100, y + 30);
  strokeWeight(0.5);
  textSize(16);
  textLeading(25);
  testFlares = Math.floor(game.numFlares * 0.05);
  selectFlares = Math.max(Math.floor(game.remainFlares * 0.5), 1);
  rules = `1. Up to ${testFlares} flares from one bag can be tested.\n2. Up to ${selectFlares} of the remaining flares from all bags can be selected.\n3. Good Flare: +100 points; Bad Flare: -1000 points.`;
  text(rules, x + 10, y + 50, 230, 300);
}

function takeTurn() {
    if (done) return;
    if (game.gameOver) {
        done = true;
        return;
    }
    current_player = game.takeTurn();
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
        this.badFlares = Math.floor(num * percent / 100);
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
      this.win = -1;

      this.players = new Array(2);
      this.players[0] = new Player(properties.player1, this.totalTime);
      this.players[1] = new Player(properties.player2, this.totalTime);

      var n = this.numBags1 + this.numBags2;
      this.remainFlares = this.numFlares * n;
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
      var pre = this.players[this.currentTurn].name;
      this.currentTurn ^= 1;
      if (this.players[this.currentTurn].end == true) {
          this.currentTurn ^= 1;
      }
      return pre;
  }

  endCurrent() {
      this.players[this.currentTurn].end = true;
      if (this.players[this.currentTurn^1].end) {
        this.gameOver = true;
        if (this.players[0].finalScore > this.players[1].finalScore) {
          this.win = 0;
        } else if (this.players[0].finalScore > this.players[1].finalScore) {
          this.win = 1;
        } else {
          this.win = 2;
        }
      }
  }

  testFlares(i, k, s=false) {
      var bag = this.bags[i];
      var n = bag.badFlares + bag.goodFlares;
      if (k > n) {
          alert("There are not enough flares in the choosen bag(s)");
          return [-1,-1];
      } else if (!s && k > Math.floor(this.numFlares/20)) {
          alert("Cannot test more than 5% of flares per bag!");
          return [-1,-1];
      }
      //k = Math.min(k, n);
      var res = 0;
      for (let j = 0; j < k; ++j) {
            res += bag.testFlare();
      }
      this.remainFlares -= k;
      return [res, k-res];
  }

  selectFlares(a) {
      var sum = 0;
      for (let i = 0; i < this.bags.length; ++i) {
          sum += a[i];
      }
      if (this.remainFlares > 1 && sum > Math.floor(this.remainFlares/2)) {
          alert("Cannot select more than 50% of flares in total!");
          return -1;
      }
      var score = 0;
      var nums = new Array(this.bags.length);
      for (let i = 0; i < this.bags.length; ++i) {
        nums[i] = this.testFlares(i, a[i], true);
        if (nums[i][0] == -1) {
          return -1;
        }
      }
      for (let i = 0; i < this.bags.length; ++i) {
          score -= nums[i][0] * 1000;
          score += nums[i][1] * 100;
      }
      this.players[this.currentTurn].finalScore += score;
      return score;
  }
}
