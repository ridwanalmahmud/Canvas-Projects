function main() {
  const canvas = document.querySelector("#canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  class Bar{
    constructor(x, y, width, height, color){
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.color = color;
    }
    update(micInput){
      this.height = micInput * 700;
    }
    draw(context){

      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  const fftSize = 512;
  const microphone = new Microphone(fftSize);
  let bars = [];
  let barWidth = canvas.width/(fftSize/2);
  function createBars() {
    for(let i = 0; i < (fftSize); i++){
      let color = `hsl(${i * 2},100%,50%)`;
      bars.push(new Bar(i * barWidth, canvas.height/2, 1, 30, color));
    }
  }
  createBars();
  function animate() {
    if(microphone.initialized) {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      const samples = microphone.getSamples();

      bars.forEach((bar, i) => {
        bar.update(samples[i]);
        bar.draw(ctx);
      })
    }

    requestAnimationFrame(animate);
  }
  animate();
}