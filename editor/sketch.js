// RECEIPT!
// This is the file to edit. p5.js reference: https://p5js.org/reference/
import JsBarcode from "jsbarcode";

export const receipt = {
  height: 810, // 240–2000 px. Width is fixed by the printer.
  seed: 67,
};

export function drawReceipt(p) {
  const { width: w, height: h } = p;
  const margin = 24;
  p.background(255);

  // Header
  p.noStroke();
  p.fill(0);
  p.textFont("monospace");
  p.textAlign(p.CENTER, p.TOP);
  p.textStyle(p.BOLD);
  p.textSize(28);
  p.text("FRACTAL CANOPY NIGHT", w / 2, 30);

  dashedLine(p, margin, 75, w - margin, 75, 6, 5);

  // tree
  p.stroke(0);

  p.push();
  p.translate(w / 2, 650);

  branch(100, p);
  p.pop();

  // moon
  p.push();
  p.stroke(0);
  p.fill(0);
  p.circle(w / 3, 200, 100);

  p.fill(255);
  p.stroke(255);
  p.circle(w / 3 + 30, 200, 100);
  p.pop();

  // A seeded field of tiny stars and radio noise. (I stole this from kartikey)
  for (let i = 0; i < 150; i += 1) {
    const x = p.random(margin, w - margin);
    const y = p.random(100, 600);
    const size = p.random([1, 1, 1, 2, 2, 3]);
    const d = p.dist(x, y, w / 3, 200);
    if (d > 50) {
    if (p.random() > 0.82) {
      p.rect(x - 3, y, 7, 1);
      p.rect(x, y - 3, 1, 7);
    } else {
      p.rect(x, y, size, size);
    }
  }
}

  // stole this too
  const ridgeTop = 650;
  for (let layer = 0; layer < 1; layer += 1) {
    p.fill(layer % 2 === 0 ? 0 : 255);
    p.stroke(0);
    p.strokeWeight(2);
    p.beginShape();
    p.vertex(margin, 700 + layer * 48);
    for (let x = margin; x <= w - margin; x += 5) {
      const wave = p.noise(x * 0.012, layer * 4.2) * 90;
      const y = ridgeTop + layer * 50 - wave;
      p.vertex(x, y);
    }
    p.vertex(w - margin, 700 + layer * 48);
    p.endShape(p.CLOSE);
  }

  dashedLine(p, margin, 710, w - margin, 710, 6, 5); // higher?

  const barcodeValue = "https://matthiaz.dev";
  drawBarcode(p, barcodeValue, w / 2, 720);

  p.noStroke();
  p.fill(0);
  p.textFont("monospace");
  p.textAlign(p.CENTER, p.TOP);
  p.textStyle(p.BOLD);
  p.textSize(13);
  p.text("receipt.hackclub.com", w / 2, 780);
}

function branch(len, p) {
  p.line(0, 0, 0, -len);
  //p.translate(0, -len);

  if (len > 4) {
    p.push();
    p.translate(0, -len);
    p.rotate(p.PI / 6);
    branch(len * 0.67, p);
    p.pop();

    p.push();
    p.translate(0, -len);
    p.rotate(-p.PI / 6);
    branch(len * 0.67, p);
    p.pop();
  }
}

function drawBarcode(p, value, centerX, y) {
  const barcodeCanvas = document.createElement("canvas");
  JsBarcode(barcodeCanvas, value, {
    format: "CODE128",
    width: 1,
    height: 52,
    displayValue: false,
    margin: 0,
    background: "#ffffff",
    lineColor: "#000000",
  });
  // Draw directly on p5's canvas: p.image expects a p5 image wrapper, while
  // JsBarcode returns a regular browser canvas.
  p.drawingContext.drawImage(barcodeCanvas, Math.floor(centerX - barcodeCanvas.width / 2), y);
}

function dashedLine(p, x1, y1, x2, y2, dash, gap) {
  p.stroke(0);
  p.strokeWeight(2);
  for (let x = x1; x < x2; x += dash + gap) {
    p.line(x, y1, Math.min(x + dash, x2), y2);
  }
}

