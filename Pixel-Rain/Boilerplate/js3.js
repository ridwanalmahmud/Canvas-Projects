const canvas = document.querySelector("#canvas1");
const ctx = canvas.getContext("2d");
const myImage = new Image();
myImage.src = "image.jpeg";

myImage.onload = function() {
  canvas.width = myImage.width;
  canvas.height = myImage.height;

  const gradient1 = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient1.addColorStop(0.2, "red");
  gradient1.addColorStop(0.3, "orange");
  gradient1.addColorStop(0.4, "pink");
  gradient1.addColorStop(0.5, "violet");
  gradient1.addColorStop(0.6, "green");
  gradient1.addColorStop(0.7, "blue");
  gradient1.addColorStop(0.8, "yellow");
  const letters = ["R", "O", "B", "I", "N"];

  ctx.drawImage(myImage, 0, 0, canvas.width, canvas.height);
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let particlesArray = [];
  let numberOfParticles = 3000;

  let mappedImage = [];
  for (let y = 0; y < canvas.height; y++){
    let row = [];
    for (let x = 0; x < canvas.width; x++){
      const red = pixels.data[(y * 4 * pixels.width) + (x * 4)];
      const green = pixels.data[(y * 4 * pixels.width) + (x * 4 + 1)];
      const blue = pixels.data[(y * 4 * pixels.width) + (x * 4 + 2)];
      const brightness = calculateBrightness(red, green, blue);
      const cell = [
        cellBrightness = brightness,
        cellColor = `rgb(${red},${green},${blue})`
      ];
      row.push(cell);
    }
    mappedImage.push(row);
  }
  function calculateBrightness(red, green, blue) {
    return Math.sqrt(
      (red * red) * 0.299 +
      (green * green) * 0.587 +
      (blue * blue) * 0.114
    )/100;
  }

  class Particle{
    constructor(){
      this.x = Math.random() * canvas.width;
      this.y = 0;
      this.speed = 0;
      this.velocity = Math.random() * 0.5;
      this.size = Math.random() * 1.5 + 1;
      this.position1 = Math.floor(this.y);
      this.position2 = Math.floor(this.x);
      this.angle = 0;
      this.letter = letters[Math.floor(Math.random() * letters.length)]

    }
    update(){
      this.position1 = Math.floor(this.y);
      this.position2 = Math.floor(this.x);
      if ((mappedImage[this.position1] && mappedImage[this.position1][this.position2])) {
        this.speed = mappedImage[this.position1][this.position2][0];
      } 

      let movement = (2.5 - this.speed) + this.velocity;
      this.angle += this.speed/20;
      this.size = this.speed;

      this.y += movement + Math.sin(this.angle) * 3;
      this.x += movement + Math.cos(this.angle) * 2;
      if(this.y >= canvas.height) {
        this.y = 0;
        this.x = Math.random() * canvas.width;
      } 
      if(this.x >= canvas.width) {
        this.x = 0;
        this.y = Math.random() * canvas.height;
      }
    }
    draw(){
      ctx.beginPath();
      if ((mappedImage[this.position1] && mappedImage[this.position1][this.position2])) {
        ctx.fillStyle  = mappedImage[this.position1][this.position2][1];
        ctx.strokeStyle = mappedImage[this.position1][this.position2][1]
      }
      //ctx.fillStyle = gradient1;
      //ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      //ctx.strokeRect(this.x, this.y, this.size * 3, this.size * 3);
      ctx.font = "6px Arial";
      ctx.fillText(this.letter, this.x, this.y)

      ctx.fill();
    }
  }
  function init() {
    for (let i = 0; i < numberOfParticles; i++){
      particlesArray.push(new Particle);
    }
  }
  init();
  function animate() {
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.2;
    for (let i = 0; i < particlesArray.length; i++){
      particlesArray[i].update();
      //ctx.globalAlpha = particlesArray[i].speed * 0.2;
      ctx.globalAlpha = 1;
      particlesArray[i].draw();
    }
    requestAnimationFrame(animate);
  }
  animate();
};