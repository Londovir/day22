export class Cube {
    constructor(_x, _y, _z, _lit) {
        this.x = _x;
        this.y = _y;
        this.z = _z;
        this.lit = _lit;
    }
    toString() {
        return `[${this.x[0]}..${this.x[1]},${this.y[0]}..${this.y[1]},${this.z[0]}..${this.z[1]}]`;
    }
    Clone() {
        return new Cube(this.x, this.y, this.z, this.lit);
    }
    Equals(ocube) {
        return (this.x[0] === ocube.x[0] &&
            this.x[1] === ocube.x[1] &&
            this.y[0] === ocube.y[0] &&
            this.y[1] === ocube.y[1] &&
            this.z[0] === ocube.z[0] &&
            this.z[1] === ocube.z[1]);
    }
}
export class Instruction {
    constructor(text) {
        this.state = text.startsWith('on');
        const coords = text.match(/x=(\d+)\.\.(\d+),y=(\d+)\.\.(\d+),z=(\d+)\.\.(\d+)/);
        this.x = [+coords[1], +coords[2]];
        this.y = [+coords[3], +coords[4]];
        this.z = [+coords[5], +coords[6]];
    }
    toString() {
        return `${this.state ? 'on' : 'off'} x=${this.x[0]}..${this.x[1]},y=${this.y[0]}..${this.y[1]},z=${this.z[0]}..${this.z[1]}`;
    }
}
//# sourceMappingURL=types.js.map