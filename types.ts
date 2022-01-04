export class Cube {
     x: [number, number];
     y: [number, number];
     z: [number, number];
     lit: boolean;

     constructor(_x: [number, number], _y: [number, number], _z: [number, number], _lit: boolean) {
          this.x = _x;
          this.y = _y;
          this.z = _z;
          this.lit = _lit;
     }

     public toString() {
          return `[${this.x[0]}..${this.x[1]},${this.y[0]}..${this.y[1]},${this.z[0]}..${this.z[1]}]`;
     }

     public Clone() {
          return new Cube(this.x, this.y, this.z, this.lit);
     }

     public Equals(ocube: Cube) {
          return (
               this.x[0] === ocube.x[0] &&
               this.x[1] === ocube.x[1] &&
               this.y[0] === ocube.y[0] &&
               this.y[1] === ocube.y[1] &&
               this.z[0] === ocube.z[0] &&
               this.z[1] === ocube.z[1]
          );
     }
}

export class Instruction {
     x: [number, number];
     y: [number, number];
     z: [number, number];
     state: boolean;

     constructor(text: string) {
          this.state = text.startsWith('on');
          const coords = text.match(/x=(\d+)\.\.(\d+),y=(\d+)\.\.(\d+),z=(\d+)\.\.(\d+)/);
          this.x = [+coords[1], +coords[2]];
          this.y = [+coords[3], +coords[4]];
          this.z = [+coords[5], +coords[6]];
     }

     public toString() {
          return `${this.state ? 'on' : 'off'} x=${this.x[0]}..${this.x[1]},y=${this.y[0]}..${this.y[1]},z=${
               this.z[0]
          }..${this.z[1]}`;
     }
}

export type interval = [number, number];
