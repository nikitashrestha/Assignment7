var gameContainer = document.getElementsByClassName('game-container')[0];
var XPOS = [20,92,164];
var arrowCount = 1;
var ROADHEIGHT = 450;
var CARHEIGHT = 50;
var CARWIDTH = 30;

var keyEvent = {
    left : 'false',
    right : 'false',
    space : 'false'
}

var gamestate = 1;
var carCollision = 0;

function getRandomNumber(min,max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) ) + min;
}


class Car{

    constructor(road,id,isPlayer,isRecharger){

        this.parenElement = road;
        this.car = null;
        this.x = null;
        this.y = null;
        this.dy = 1;
        this.id = id;
        this.isPlayer = isPlayer;
        this.isRecharger = isRecharger;
        this.create();
    
    }

    create(){

        this.car = document.createElement('div');
        
        if(!this.isRecharger){
            this.car.style.backgroundImage = 'url("images/'+(this.id+1)+'.png")';
            this.car.classList.add('car');
        }
        else{
            this.car.classList.add('bullet-recharger');
        }
    }

    setPosition(x,y){

        this.x = x;
        this.y = y;

    }

    move(){
    
        if(gamestate == 1){
            this.y += this.dy;
            this.draw();
        }       
    }

    reverseDirection(){

        this.y -= this.dy;
        this.draw();
        
    }

    detectYCollision(player){

        if(((this.y+CARHEIGHT)==(ROADHEIGHT-CARHEIGHT)) && (this.x==player.x)){

            return true;

        }

        else{

            return false;

        }
        
    }

    detectXCollision(player){

        if((this.x== player.x) && ((ROADHEIGHT-CARHEIGHT)<=(this.y+CARHEIGHT))){
                
            // player.setPosition()
            return true;
        
        }
        else{
            return false;
        }
    }

    draw(){

        this.car.style.left = this.x + 'px';

        if(this.isPlayer){

            this.car.style.bottom = this.y +'px';
            this.car.style.transform = 'scaleY(-1)';
            this.car.style.filter= 'FlipV';

        }
        else{

            this.car.style.top = this.y + 'px';
        
        }
        
        this.parenElement.appendChild(this.car);
    }

}


class Bullet{
    constructor(roadContainer,player){
        this.roadContainer = roadContainer;
        this.bullet = document.createElement('div');
        this.bullet.classList.add('bullet');
        this.y = ROADHEIGHT - CARHEIGHT - 10;
        this.x =player.x + CARWIDTH/2;
        this.dy = 5;
        this.domIndex = this.roadContainer.children.length-1;
    }

    draw(){
        this.bullet.style.left = this.x + 'px';
        this.bullet.style.top = this.y + 'px';
        this.roadContainer.appendChild(this.bullet);
    }

    move(){
        if(gamestate == 1){

            this.y -= this.dy*6;
            this.draw();

        }
    }

    checkCollision(opponentCar){
        for(let i = 0; i<opponentCar.length;i++){

            if(opponentCar[i].x <= this.x && this.x <= opponentCar[i].x + CARWIDTH && opponentCar[i].y>=0){
                if(this.y <= opponentCar[i].y+CARHEIGHT){
                    console.log('second');
                    //this.roadContainer.removeChild(this.bullet);
                    this.roadContainer.removeChild(opponentCar[i].car);
                    opponentCar.splice(i,1);
                    return true;
                }
            }
            else{
                return false;
            }
        } 
    }
}

class Game{

    constructor(gameContainer){

        this.parenElement = gameContainer;
        this.scoreCount = 0;
        this.carImages = ['1.png','2.png','3.png','4.png'];
        this.carHolder = [];
        this.carImagesTag = [];
        this.player = null;
        this.playerID = null;
        this.obstacles = [];
        this.recharger = [];
        this.arrowCount = 1;
        this.roadBgBotttom = 0;
        this.gameOverDiv = null;
        this.yesButton = null;
        this.noButton = null;
        this.bullet = [];
        this.bulletCount = 10;
        this.isCreateRecharger = true;

        //creating game elements
        this.scoreBoard = document.createElement('div');
        this.gameWindow = document.createElement('div');
        this.selectCarDiv = document.createElement('div');
        this.selectCarHeader =document.createElement('h1');
        this.startGameButton = document.createElement('button');
        this.road = document.createElement('div');
        this.roadBg = document.createElement('div');
        this.leftLane = document.createElement('div');
        this.midLane = document.createElement('div');
        this.rightLane = document.createElement('div');
        this.bulletDiv = document.createElement('div');

        //Adding css property
        this.selectCarDiv.classList.add('select-car');
        this.scoreBoard.classList.add('score-board');
        this.gameWindow.classList.add('game-window');
        this.road.classList.add('road');
        this.roadBg.classList.add('road-bg');
        this.leftLane.classList.add('left-lane');
        this.midLane.classList.add('mid-lane');
        this.rightLane.classList.add('right-lane');
        this.bulletDiv.classList.add('bullet-count');
        
        //Adding to DOM
        this.parenElement.appendChild(this.scoreBoard);
        this.parenElement.appendChild(this.bulletDiv);
        this.parenElement.appendChild(this.gameWindow);
        this.gameWindow.appendChild(this.selectCarDiv);
        this.road.appendChild(this.roadBg);
        this.roadBg.appendChild(this.leftLane);
        this.roadBg.appendChild(this.midLane);
        this.roadBg.appendChild(this.rightLane);

        this.showScore();
        this.createSelectCarWindow();
        
    }

    showScore(){

        this.scoreBoard.innerHTML = 'Score<br>' + this.scoreCount;
    }

    showBulletCount(){
        this.bulletDiv.innerHTML = 'Bullet Left<br>' + this.bulletCount;
    }

    createSelectCarWindow(){

        this.selectCarHeader.innerHTML = 'Select Your Car';
        this.selectCarDiv.appendChild(this.selectCarHeader);

        for(let i=0; i<this.carImages.length; i++){

            this.carHolder[i] = document.createElement('div');
            this.carImagesTag[i] = document.createElement('img');
            this.carImagesTag[i].setAttribute('src','./images/'+this.carImages[i]);

            this.carHolder[i].classList.add('car-holder');
            this.carImagesTag[i].classList.add('car-img');
            this.carHolder[i].setAttribute('id',i);
            this.carHolder[i].appendChild(this.carImagesTag[i]);
            this.selectCarDiv.appendChild(this.carHolder[i]);

        }

        this.selectCarDiv.classList.add('clearfix');
        this.startGameButton.innerHTML = "Start Game";
        this.selectCarDiv.appendChild(this.startGameButton);
        this.selectPlayer();
        this.startGame();
    }

    selectPlayer(){

        var carHolder = this.selectCarDiv.getElementsByTagName('div');
        var that = this;

        for(let i=0; i<carHolder.length; i++){
            
            carHolder[i].onclick = function(){

                that.player = new Car(that.road,i, true);
                carHolder[i].style.border = '1px solid red';
                
            }
        } 
    }
    
    onArrowKeyPressed(){

        var that = this;

        document.addEventListener('keydown', function(event){

            if(event.defaultPrevented){

                return;

            }

            var key = event.key || event.keyCode;
        
            switch(key){

                case 'ArrowLeft':
    
                    if(arrowCount<=0){
    
                        arrowCount=0;

                        that.player.setPosition(XPOS[arrowCount],0);
                        // that.detectXCollision(that.player,that.obstacles)

                    }
                    else{
    
                        arrowCount-=1;
                        that.player.setPosition(XPOS[arrowCount],0);
                    }
                    
                    that.player.draw();
                    break;
    
                case 'ArrowRight':
    
                    if(arrowCount>=2){
    
                        arrowCount = 2;
                        that.player.setPosition(XPOS[arrowCount],0);

                    }
                    else{
    
                        arrowCount+=1;
                        that.player.setPosition(XPOS[arrowCount],0);

                    }
                    
                    that.player.draw();
                    break;
                
                case ' ':
                    keyEvent.space = 'true';
                   
                    that.createBullet();
                    console.log(that.bulletCount);
                    break;
            }
        })

        document.addEventListener('keyup', function(event){
            if(event.defaultPrevented){

                return;

            }

            var key = event.key || event.keyCode;

            switch(key){
                
                case ' ':
                    keyEvent.space = 'false';
                    break;
            }
        }
        );
    }

    createInstances(){

        this.player.setPosition(XPOS[1],0);
        this.player.draw();

    }

    moveBackground(){
        var that = this;
        var interval = setInterval(function(){

            if(gamestate == 1){

                that.roadBgBotttom -= 5;
                that.roadBg.style.bottom = that.roadBgBotttom+'px';

            }
            else{

                clearInterval(interval);

            }
            
        },100);
    }

    createObstacles(playerID){
        
        var that = this;
        var interval = setInterval(function(){
            if(gamestate == 1){
                var randomCar = getRandomNumber(0,4);
                if(randomCar == playerID && randomCar>=0 && randomCar<3){

                    randomCar += 1;

                }

                else if(randomCar==playerID && randomCar>=3)
                {

                    randomCar = 2;

                }

                var car = new Car(that.road,randomCar,false,false);
                car.setPosition(XPOS[getRandomNumber(0,3)],getRandomNumber(-100,-90));

                if(that.obstacles.length>2){
        
                    var diff = car.y - that.obstacles[that.obstacles.length - 1].y;

                    if(Math.abs(diff) < 100){

                        car.y += diff;
                        console.log(car.y);

                    }
                }
                that.obstacles.push(car);}
                else{

                    clearInterval(interval);

                }
            },2000)
    }

    createRacharger(){
        var that = this;
        var interval = setInterval(function(){
            console.log('recharger');
            if(that.bulletCount <= 0 && gamestate == 1 && that.isCreateRecharger){
                console.log('recharger created');
                var recharger = new Car(that.road,0,false,true);
                recharger.setPosition(XPOS[getRandomNumber(0,3)],getRandomNumber(-100,-90));
                if(that.recharger.length>2 && that.obstacles.length>2){
                    var diff1 = recharger.y - that.recharger[that.recharger.length - 1];
                    if(diff1 <= 100){
                        recharger.y += diff1;
                    }
                    var diff2 = recharger.y - that.obstacles[that.obstacles.length-1];
                    if(diff2 < CARHEIGHT){
                        that.obstacles[that.obstacles.length-1].y+=diff2;
                    }
                }
                that.recharger.push(recharger);
            }
        },2000)
    }

    startGame(){
        
        var that=this;
      
        this.startGameButton.onclick = function(){
            that.showBulletCount();
            that.playerID = that.player.id;
            that.createInstances();
            that.onArrowKeyPressed();
            that.createObstacles(that.player.id);
            that.createRacharger();
            that.gameWindow.removeChild(that.selectCarDiv);
            that.gameWindow.appendChild(that.road);
        }
    }

    createGameOverWindow(){
        
        this.gameOverDiv = document.createElement('div');
        this.yesButton = document.createElement('button');
        this.gameOverDiv.classList.add('game-over');
        this.yesButton.classList.add('button-style');


        this.gameOverDiv.innerHTML = '<br><br>Game Over<br><br>Play Again <br><br>';
        this.yesButton.innerHTML = 'Yes';

        this.gameWindow.appendChild(this.gameOverDiv);
        this.gameOverDiv.appendChild(this.yesButton);

        var that = this;
        this.yesButton.onclick = function(){
            document.location.reload() ;
        }
    
    }

    removeOpponentCar(opponentCar,index,opponentCarArray){
        // console.log('hel');
        
        this.road.removeChild(opponentCar.car);
       
        opponentCarArray.splice(index,1);
    }

    removeBullet(bulletobj){
        //console.log('insode remove bullet');
        this.road.removeChild(bulletobj.bullet);
    }

    createBullet(){
        let bullet;
        if(gamestate == 1 && keyEvent.space == 'true'){

            
            if(this.bulletCount>0){
                this.bulletCount--;
                bullet = new Bullet(this.road,this.player);
                bullet.move();
                this.bullet.push(bullet);
            }
        } 
    }

    update(){
        var x = null;
        for(let i = 0; i < this.bullet.length; i++){
            if(this.bullet[i].y<=0){
                //console.log(this.bullet[i]);
                this.removeBullet(this.bullet[i]);
                this.bullet.splice(i,1); 
            }
            else{
                this.bullet[i].move();  
                x = this.bullet[i].checkCollision(this.obstacles);
                if(x){
                    this.scoreCount+=2;
                    this.removeBullet(this.bullet[i]);
                    this.bullet.splice(i,1); 
                }
                
            }
            
        }

        for(let j = 0; j < this.obstacles.length ;j++){
            this.obstacles[j].move();
        }

        for(let k = 0; k< this.recharger.length; k++){
            this.recharger[k].move();
        }
    }

    gameLoop(){

        this.startGame();
        this.moveBackground();
        var that = this;

        var interval = setInterval(function(){

            that.showScore();
            
            that.showBulletCount();
            that.update();

            for(let i=0;i<that.obstacles.length;i++){
                
                if((that.obstacles[i].y>ROADHEIGHT)){
                
                    that.scoreCount++;
                    that.removeOpponentCar(that.obstacles[i], i, that.obstacles);

                }

                else{

                    if(that.obstacles[i].detectYCollision(that.player)){

                        clearInterval(interval);
                        gamestate = 0;
                        that.obstacles[i].reverseDirection();
                        that.player.reverseDirection();
                        that.createGameOverWindow();

                    }
                    else if(that.obstacles[i].detectXCollision(that.player)){

                        clearInterval(interval);
                        gamestate = 0;
                        that.createGameOverWindow();

                    }
                }  
            }

            for(let i=0;i<that.recharger.length;i++){
                
                if((that.recharger[i].y>ROADHEIGHT)){
                
                    that.removeOpponentCar(that.recharger[i], i, that.recharger);

                }

                else{

                    if(that.recharger[i].detectYCollision(that.player)){
                        that.isCreateRecharger = false;
                        that.bulletCount = 10;
                        that.scoreCount++;
                        that.removeOpponentCar(that.recharger[i], i, that.recharger);

                    }
                    else if(that.obstacles[i].detectXCollision(that.player)){

                        that.isCreateRecharger = false;
                        that.bulletCount = 10;
                        that.scoreCount++;
                        that.removeOpponentCar(that.recharger[i], i, that.recharger);

                    }
                }  
            }
        },1000/60);
    }
}

game1 = new Game(gameContainer);
game1.gameLoop();

