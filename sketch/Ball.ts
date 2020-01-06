class Ball {
    private dx!: number;
    private dy!: number;
    private ballSpeedX: number;
    private ballSpeedY: number;
    private startDirection: Array <number>;
    

    constructor() {
        this.startDirection = [4, -4];
        this.ballSpeedX = 7;
        this.ballSpeedY = -7;
    }
    update(): void {
        this.setStartDirection();
    }
    draw(): void {
        this.moveBall(); // should be in update() but it only works from here right now
        this.drawBall();
    }

    drawBall() {
        fill(255, 255, 255);
        stroke(0, 0, 0);
        strokeWeight(2);
        ellipse(ballXPosition, ballYPosition, ballRadius * 2, ballRadius * 2);

        this.handleBall();
    }

    // move ball
    moveBall(): void {
        ballXPosition += this.ballSpeedX;
        ballYPosition += this.ballSpeedY;

        // update variables
        this.dx = ballXPosition - width / 2;
        this.dy = ballYPosition - height / 2;
    }
    setStartDirection(): void { //Randomizes direction
        this.ballSpeedX = this.startDirection[Math.floor(Math.random()*this.startDirection.length)];
        this.ballSpeedY = this.startDirection[Math.floor(Math.random()*this.startDirection.length)];
    }
    // check for ball collision
    handleBall() {
        for (const player of gameManager.players) {
            for (let i = 0; i <= player.pad.getPadLength; i++) {
                if (player.playerXCoordinates[i] && player.playerYCoordinates[i]) {
                    // bounce on ball - pad collision
                    if (dist(ballXPosition, ballYPosition, player.playerXCoordinates[i], player.playerYCoordinates[i]) < ballRadius + .5) {
                        this.bounceBackFromPad();
                    }
                }
            }
        }
    }

    ballSize(): void { }

    // ball bounces
    bounceBackFromPad(): void {
        if (dist(ballXPosition, ballYPosition, width / 2, height / 2) >= circleSize / 2 - 5) {
            const velocity = Math.sqrt(this.ballSpeedX * this.ballSpeedX + this.ballSpeedY * this.ballSpeedY);
            let angleToCollisionPoint = Math.atan2(-this.dy, this.dx);
            var oldAngle = Math.atan2(-this.ballSpeedY, this.ballSpeedX);
            var newAngle = 2 * angleToCollisionPoint - oldAngle;

            this.ballSpeedX = -velocity * Math.cos(newAngle);
            this.ballSpeedY = velocity * Math.sin(newAngle);

            const vector = createVector(this.dx, this.dy);
            vector.normalize();
            const scalar = (circleSize / 2 - ballRadius);
            vector.mult(scalar);
            ballXPosition = vector.x + width / 2;
            ballYPosition = vector.y + height / 2;
            this.handleBall();
        }
    }
}