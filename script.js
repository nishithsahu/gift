let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    const updatePosition = (e) => {
      e.preventDefault();
      const clientX = e.clientX ?? e.touches[0].clientX;
      const clientY = e.clientY ?? e.touches[0].clientY;

      if (!this.rotating) {
        this.mouseX = clientX;
        this.mouseY = clientY;

        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = clientX - this.mouseTouchX;
      const dirY = clientY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('touchmove', updatePosition, { passive: false });

    const startInteraction = (e) => {
      e.preventDefault();
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      const clientX = e.clientX ?? e.touches[0].clientX;
      const clientY = e.clientY ?? e.touches[0].clientY;

      if (e.button === 0 || e.touches) {
        this.mouseTouchX = clientX;
        this.mouseTouchY = clientY;
        this.prevMouseX = clientX;
        this.prevMouseY = clientY;
      }
      if (e.button === 2) {
        this.rotating = true;
      }
    };

    paper.addEventListener('mousedown', startInteraction);
    paper.addEventListener('touchstart', startInteraction, { passive: false });

    const endInteraction = (e) => {
      e.preventDefault();
      this.holdingPaper = false;
      this.rotating = false;
    };

    window.addEventListener('mouseup', endInteraction);
    window.addEventListener('touchend', endInteraction, { passive: false });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
