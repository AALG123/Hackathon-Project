
//Credit to FIREFISTPOKEMONYT for the tutorial on how to create 3D text in p5.js
p5.prototype.Object3D = function(depth, size, resolution, bevelled) {
    this.depth = depth;
    this.size = size;
    this.resX = resolution;
    this.resY = resolution;
    this.bevelled = bevelled;

    this.edges = [this.resX, 0]
    this.width = 0;

    this.toArray = function(graphic, mod = 0) {
        var array = [];
        graphic.loadPixels();
        for (var x = 0; x < graphic.width - mod; x++) {
            array.push([]);
            for (var y = 0; y < graphic.height - mod; y++) {
                if (graphic.get(x, y)[0] <= 60) {
                    array[x].push(1);
                    this.edges[0] = x < this.edges[0] ? x : this.edges[0];
                    this.edges[1] = x > this.edges[1] ? x : this.edges[1];
                } else {
                    array[x].push(0);
                }
            }
        }

        this.width = constrain(
          Math.abs(this.edges[1] - this.edges[0] + 4),
          this.resX * 0.4,
          this.resX * 1.1
        );

        return array;
    }

    this.modX = function() {
        return (this.resX / 2)
    }

    this.modY = function() {
        return (this.resY / 2)
    }

    this.show = function() {
        push();
        for (var Rect of this.rects) {
            var w = Rect.x2 - Rect.x1 + 1;
            var h = Rect.y2 - Rect.y1 + 1;
            var xPos = Rect.x1 + w / 2 - this.modX();
            var yPos = Rect.y1 + h / 2 - this.modY();

            push();

            translate(xPos * this.size, yPos * this.size, 0);
            box(w * this.size, h * this.size, this.depth * this.size * Rect.b);
            pop();
        }
        pop();
    }
}


p5.prototype.Letter3D = function(letter, depth, size, resolution, bevelled = true, font = "Georgia", style = BOLD) {
    this.letter = letter;
    this.font = font;
    this.style = style;

    this.create = function() {
        var graphic = createGraphics(this.resX, this.resY);
        graphic.textAlign(CENTER, CENTER);
        graphic.textSize(this.resX * 6 / 5);
        graphic.textFont(this.font);
        graphic.textStyle(this.style);
        graphic.background(255);
        graphic.text(this.letter, graphic.width / 2, graphic.height / 2);

        return graphic;
    }

    p5.prototype.Object3D.call(this, depth, size, resolution, bevelled);
    this.array = this.toArray(this.create());
    this.rects = p5.prototype.getRects(this.array, this.bevelled);

    this.modX = function() {
        return this.edges[0]
    }
};


p5.prototype.Word3D = function(string, depth, size, resolution, bevelled = true, font = "Georgia", style = BOLD) {
    this.string = string;
    this.depth = depth;
    this.size = size;
    this.res = resolution;
    this.bevelled = bevelled;
    this.font = font;
    this.style = style;
    this.width = 0;

    this.create = function() {
        var array = [];
        this.width = 0;
        for (var i = 0; i < string.length; i++) {
            var temp = new p5.prototype.Letter3D(
              string[i], this.depth, this.size, this.res, this.bevelled, this.font, this.style
            );
            this.width += temp.width;
            array.push(temp);
        }

        return array;
    }

    this.letters = this.create();

    this.setText = function(string) {
        this.string = string;
        this.create();
    }

    this.show = function() {
        push();
        translate(-this.width * this.size * 0.5, 0, 0);
        for (var letter of this.letters) {
            letter.show();
            translate((letter.width) * this.size, 0, 0);
        }
        pop();
    }
}


p5.prototype.Picture3D = function(picture, depth, size, resolution, bevelled = false) {
    this.picture = picture;

    this.create = function() {
        var graphic = createGraphics(this.resX, this.resY);
        graphic.background(255, 255, 255, 255);
        graphic.image(this.picture, -1, -1, this.resX, this.resY);

        return graphic;
    }

    p5.prototype.Object3D.call(this, depth, size, resolution, bevelled);
    this.resX = this.picture.width*resolution;
    this.resY = this.picture.height*resolution;
    this.array = this.toArray(this.create(), 1);
    this.rects = p5.prototype.getRects(this.array, this.bevelled);
}


p5.prototype.Canvas3D = function(canvas, depth, size, resolution, bevelled = false) {
    this.canvas = canvas;

    this.create = function() {
        return this.canvas;
    }

    p5.prototype.Object3D.call(this, depth, size, resolution, bevelled);
    this.resX = this.canvas.width*resolution;
    this.resY = this.canvas.height*resolution;
    this.array = this.toArray(this.create());
    this.rects = p5.prototype.getRects(this.array, this.bevelled);
}


p5.prototype.getRects = function(array, bevel) {
    var mat = array;
    var inner = Array(mat.length).fill(0).map(x => Array(mat.length).fill(0));
    var rects = [];

    if (bevel) {
        for (var x = 0; x < mat.length; x++) {
            for (var y = 0; y < mat.length; y++) {
                var notEdge = (x > 0 &&
                  y > 0 &&
                  x < (mat.length - 1) &&
                  y < (mat.length - 1)
                );

                var surrounded = (notEdge &&
                  mat[x - 1][y] &&
                  mat[x + 1][y] &&
                  mat[x][y - 1] &&
                  mat[x][y + 1]
                );

                if (surrounded) {
                    inner[x][y] = 1;
                }
            }
        }
        for (var item of getRects1(inner)) {
            item.b = 1.5;
            rects.push(item);
        }
    }
    for (var item of getRects1(array)) {
        item.b = 1;
        rects.push(item);
    }

    return rects;
}

function getRects1(array) {
    var mat = array[0].map((col, i) => array.map(row => row[i]));

    const W = mat[0].length;
    const H = mat.length;

    let totalRectArea = 0;
    for (let i = 0; i < W; ++i) {
        for (let j = 0; j < H; ++j) {
            totalRectArea += mat[j][i] > 0 ? 1 : 0;
        }
    }

    const rects = [];
    let rectArea = 0;

    while (rectArea < totalRectArea) {
        const rect = findNextRect();
        rects.push(rect);
        markRect(rect);
        rectArea += (rect.x2 - rect.x1 + 1) * (rect.y2 - rect.y1 + 1);
    }

    function findNextRect() {
        let foundCorner = false;
        const rect = {
            x1: 0,
            x2: W - 1,
            y1: 0,
            y2: H - 1
        };
        for (let i = 0; i < W; ++i) {
            for (let j = 0; j < H; ++j) {
                if (mat[j][i] === 1) {
                    rect.x1 = i;
                    rect.y1 = j;
                    foundCorner = true;
                    break;
                }
            }
            if (foundCorner) break;
        }
        for (let i = rect.x1; i <= rect.x2; ++i) {
            if (mat[rect.y1][i] !== 1) {
                rect.x2 = i - 1;
                return rect;
            }
            for (let j = rect.y1; j <= rect.y2; ++j) {
                if (mat[j][i] !== 1) {
                    rect.y2 = j - 1;
                    break;
                }
            }
        }
        return rect;
    }

    function markRect({
                          x1,
                          y1,
                          x2,
                          y2
                      }) {
        for (let i = x1; i <= x2; ++i) {
            for (let j = y1; j <= y2; ++j) {
                mat[j][i] = 2;
            }
        }
    }
    return rects;
};
