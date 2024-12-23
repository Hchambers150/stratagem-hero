var active = [];
var stratagems;
var trueActive;
let sprites = [];
let screenshake = false;
let timerG;
let difficulty = 0;
let punishAmount = 5;
let pace = 4;
let score = 0;

// let errorsound1;
// let errorsound2;
// let winsound1;
// let winsounn2;

function preload(){
  try {
    errorsound1 = loadSound('sounds/errorsound1.mp3');
    errorsound2 = loadSound('sounds/errorsound2.mp3');
    winsound1 = loadSound('sounds/winsound1.mp3');
    winsound2 = loadSound('sounds/winsound2.mp3');

    errorsound1.setVolume(0.25); // bonker
    errorsound2.setVolume(0.15); // long one
    winsound1.setVolume(0.15); // dink
    winsound2.setVolume(0.11); // resetter
  } catch (error) {
    console.log("offline");
  }
}

function reset(){
  active = [];
  trueActive = null;
  sprites = [];
  f = 0;
  timer = 15;
  angry = false;
  happy = false;
  frameT = 0;
  correct = 0;
  setVolume(0.25)

  deleteSprites();
  // timerG = new Timer();
  // timerG.length = 100;
  makeStratagems(1);
  background(51);
  draw();
}

function setup() {
  // put setup code here

  eWH = windowHeight;
  canvas = createCanvas(windowWidth, eWH);
  canvas.parent('canvasDIV');

  makeStratagems(1);
  timerG = new Timer();
  background(51);
}

var f = 0;
var timer = 15;
let angry = false;
let frameT = 0;
let happy = false;
let correct = 0;

function draw() {

  f++;
  if(f/10 == int(f/10)){
    //print("awesome sauce")
    background(51);
    timerG.decrease();

    if(angry){
      frameT = shakeScreen(frameT);
      background(200 + random(0,55), 55 , 0)
    }

    drawSprites();
    //print(trueActive);
    if(trueActive != null){
      textSize(100);
      textFont('Helvetica');

      let p = new Text(trueActive.patternString);
    }
  }

  // 38 37 40 39

}

class Text{
  constructor(patternString){
    this.total = patternString.split(" ");
    // print(this.total);
    // print(this.total)

    for(let i = 0; i < this.total.length; i++){
      if(i <= int(correct-1)){
        fill(0,255,0);
      } else (
        fill(0,0,0)
      )
      text(
        this.total[i],
        windowWidth/2-(this.total.length*50)-50+i*110, 700
      )
    }
  }
}

let og;
let ogPos;

function getPositions(){

  let positions = [];
  let toReturn = [];

  for(sprite in sprites){
    // print(sprites[sprite])
    toReturn.push([sprites[sprite].name,sprites[sprite].position.x, sprites[sprite].position.y]) ;
  }

  // print(toReturn)
  return(toReturn);

}

function putBack(){
  for(sprite in sprites){
    if(sprites[sprite].name == ogPos[sprite][0]){
      sprites[sprite].position.x = ogPos[sprite][1];
      sprites[sprite].position.y = ogPos[sprite][2];
    }
  }
}

function shakeScreen(frame){ // original coordinates ?? of each sprite?

  if(frame == 0){
    // print(sprites);
    // getPositions();
    og = sprites;
    ogPos = getPositions();
    timerG.timerSprite.width -= punishAmount;
    score -= 50;
    try{
      errorsound1.play();
      errorsound2.play();
    } catch(error){
      console.log("nosounds!")
    }

    // print(og.length)
    // print(og)
  } else if (frame == 5) {
    angry = false;
    og = null;
    correct = 0;
    putBack();
    background(51);
    return(0);

    try{
      errorsound1.stop();
      errorsound2.stop();
    } catch(error){
      console.log("nosounds!")
    }
    return(0);
  }
  // print(frame)

  for(sprite in sprites){
    // print(sprites[sprite])
    let s = sprites[sprite];
    if(s != null){
      // print(ogPos[sprite])
      s.position.x = ogPos[sprite][1] +- int(random(0,20));
      s.position.y = ogPos[sprite][2] +- int(random(0,20));
      // s.position.x = 500 + s.position.y +- int(random(0,20));
      background(255,0,0)
    }
  }

  frame++;
  //print("hello?")
  return(frame);
}

let level = 0;

function moreDiff(){
  difficulty++;
  punishAmount += 5;
  pace += 0.5;
  print("DIFF: "+ difficulty);
  score += 150;
  if(difficulty/5==int(difficulty/5)){
    // level increase
    level++;
    print(level);

  }
      timerG.timerSprite.width = timerG.timerSprite.maxWidth;
}

function keyPressed(){
  if(key == "ArrowUp" && trueActive.truePattern[0] == 2 && !angry){ // up
    doCorrect();
  }
  else if(key == "ArrowLeft" && trueActive.truePattern[0] == 3 && !angry ){ // left
    doCorrect();
  }
  else if(key == "ArrowRight" && trueActive.truePattern[0] == 1 && !angry){ // right
    doCorrect();
  }
  else if(key == "ArrowDown" && trueActive.truePattern[0] == 4 && !angry){ // down
    doCorrect();
  } else if(key == "ArrowDown" || key == "ArrowRight" || key == "ArrowLeft" || key == "ArrowUp"){
    //print("loss!")
    trueActive.truePattern = structuredClone(trueActive.pattern);
    // print(trueActive.truePattern +" "+ trueActive.pattern);
    angry = true;
    // do screenshake
  } else if (key == "r"){
    reset();
  }
}

let winAmount = 15;

function doCorrect(){
  try{
    winsound1.play();
  } catch(error2){"no sound!"}

  trueActive.truePattern.splice(0,1);
  happy = true;
  correct++;
  score += 50;
  if(trueActive.truePattern.length == 0){
    //print("Epic win style!");
    active.splice(0,1);
    correct = 0;
    trueActive.sprite.shapeColor = color("gray");
    timerG.timerSprite.width += winAmount;
    if(active.length >= 1){
          trueActive = active[0];
    } else { // TIMERSPACE
            try{  winsound2.play();}catch(error){"no sound!"}
      print("hoya!",(timerG.timerSprite.width += winAmount*5) < timerG.timerSprite.maxWidth)
      moreDiff();
      if((timerG.timerSprite.width += winAmount*5) < timerG.timerSprite.maxWidth){
        timerG.timerSprite.width += winAmount*5;
        try{  winsound2.play();}catch(error){"no sound!"}
      } else {
        timerG.timerSprite.width = timerG.timerSprite.maxWidth;
      }
      correct = 0;
      deleteSprites();
      makeStratagems(difficulty);
    }

  }
  //print(trueActive.truePattern +" "+ trueActive.pattern)
  // print("epic")
}

function deleteSprites(){
  for(sprite in sprites){
    if(sprites[sprite].name != "Timer" && sprites[sprite].name != "TimerBG"){
      sprites[sprite].remove();
    }
  }
    background(51);
}

function makeStratagems(x){

  for(let i = 0; i < x; i++){
    active[i] = new Stratagem(i,x);
    if(i == 0){trueActive = active[0]};
  }
}

class Timer{
  constructor(){
    // this.length = 100;
    this.outerSprite = createSprite(
      windowWidth/2, 550,
      600, 30
    );
    this.outerSprite.shapeColor = color("lightgreen");
    this.outerSprite.name = "TimerBG";

    this.timerSprite = createSprite(
      windowWidth/2, 550,
      595, 27
    );
    this.timerSprite.maxWidth = this.timerSprite.width;
    this.timerSprite.shapeColor = color("green")
    this.timerSprite.name = "Timer";

    sprites[sprites.length] = this.timerSprite;
    //print(sprites.length)
    sprites[sprites.length] = this.outerSprite;
    //print(sprites.length)
  }

  decrease(){
    if(this.timerSprite.width > 0){
      this.timerSprite.width -= pace;
    } else {
      this.timerSprite.remove();
      this.outerSprite.shapeColor = color(230,15,0) // lose
      print("lose")
      textSize(150);
      textFont("Courier New");
      text("Score: "+score, 100,100);
    }
  }
}

class Stratagem{
  constructor(i,a){

      if(i==a){this.isActive = true; trueActive = this;}else{this.isActive = false;}

      this.icon = "";
      this.difficulty = 1;
      this.pattern = null;
      this.name = null;

      this.pickAStratagem();
      //print(this.pattern);
      const temp = this.makeText(this.pattern);
      this.pattern = temp[1];
      this.truePattern = structuredClone(this.pattern) ;
      this.patternString = temp[0];

      this.sprite = this.create(i,a);
      this.sprite.name = this.name;
      this.sprite.shapeColor = color(str(this.color));



      sprites[sprites.length] = this.sprite;
  }

  makeText(x){
    const toSplit = this.parsePattern(this.pattern);
    x = str(toSplit[1]);
    x = x.join(" ");

    const toReturn = [x, toSplit[0]];
    return(toReturn);
  }

  parsePattern(p){
    // print(p)
    console.log(p)
    p = p.split("");
    // print(p)
    let o = [];
    for(let i = 0; i < str(p.length); i++){
      //print("a "+p.length,p[i]);
      switch(p[i]){
        case ">":
        p[i] = 1; //right 39
        o[i] = "🡆";
        break;
        case "^":
        p[i] = 2; //up 38
        o[i] = "🡅";
        break;
        case "<":
        p[i] = 3; //left 37
        o[i] = "🡄";
        break;
        case "v":
        p[i] = 4; //down 40
        o[i] = "🡇";
        break;
      }
    }
    const toReturn = [p,o];
    return(toReturn);
  }

  pickAStratagem() {
    const num = int(random(0,stratagems.length));

    this.name = stratagems[num][0];
    print(this.name);
    this.pattern = stratagems[num][1];
    this.color = stratagems[num][2];
    // print(stratagems[num])
  }


  create(i,a){
    const size = 100;
    const x = i*150+75;

    return(createSprite(
      (windowWidth/2+i*110)-(a/2*size-15  ),
      windowHeight/2-250,
      size, size));
  }
}

// stratagems = [
//   ["jetpack",">>^^vv><", "blue"],
//   ["machinegun",">^v<^>", "red"],
//   ["machinegerm",">^v<^>>>>>>>>", "yellow"],
//   ["gatling barrage", ">v<^^", "red"],
//   ["airburst strike",">>>", "red"],
//   ["120mm he barrage", ">vv^^<vvv", "red"],
//   ["380mm he barrage", ">vv^^<vvv", "red"],
//   ["walking barrage", ">v>v>v", "red"],
//   ["laser strike", ">^<^><", "red"],
//   ["railcannon strike", ">v^v<", "red"],
//   ["eagle stragfing run", ""]
// ];

//↑ ↓ → ←


// stratagems = [
//     ["cheat", ">>>", "blue"]
//   ];
