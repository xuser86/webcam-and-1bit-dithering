onmessage = msg => {
  if (msg.data && msg.data.image) {
    postMessage(
      binarize(
        grayscale({image: msg.data.image})
      )
    );
  }
};


function grayscale({image}) {
  for (let i = 0; i < image.data.length; i += 4) {
    const r = image.data[i];
    const g = image.data[i + 1];
    const b = image.data[i + 2];

    //let grayvalue = Math.max(r,g,b);
    let grayvalue = Math.round((r + g + b) / 3);

    image.data[i] = grayvalue;
    image.data[i + 1] = grayvalue;
    image.data[i + 2] = grayvalue;
  }
  return {image};
}

function binarize({image}) {
  let x = 0, y = 0;
  for (let i = 0; i < image.data.length; i += 4) {
    const v = image.data[i];
    let v1 = 0;

    if (v > 127) {
      v1 = 255;
    } else {
      v1 = 0;
    }

    if (x !== 0 && y !== 0 && x !== image.width - 1 && y !== image.height - 1) {
      const e = (v - v1) / 16;

      image.data[i + 4] += e * 7;
      image.data[i + (image.width - 1) * 4] += e * 3;
      image.data[i + image.width * 4] += e * 5;
      image.data[i + (image.width + 1) * 4] += e;
    }

    image.data[i] = v1;
    image.data[i+1] = v1;
    image.data[i+2] = v1;

    x++;
    if (x => image.width) {
      x -= image.width;
      y++;
    }
  }
  return {image};
}