import * as fs from 'fs';
import { Cube, Instruction } from './types.js';
function Run() {
    const file = fs.readFileSync('test.txt', 'utf8');
    const data = GetData(file);
    console.log(data);
    const result = GetResult(data);
    console.log(`Part 1 result: ${result}`);
    // const result2 = GetResultPart2(data);
    // console.log(`Part 2 Results:\nPlayer 1: ${result2.P1Wins}\nPlayer 2: ${result2.P2Wins}`);
}
function GetData(input) {
    const ins = input.split(/\r\n/).map((t) => new Instruction(t));
    return ins;
}
function GetResult(data) {
    const litcubes = [];
    for (let d of data) {
        if (d.state) {
            // Turning on cubes. We add the new cuboid as instructed (as lit), then we call the reduce function on the master list of lit cubes so it'll simplify them down to
            // remove intersections.
            const newcube = new Cube(d.x, d.y, d.z, d.state);
            litcubes.push(newcube);
            console.log(`Added new cuboid per instructions: ${newcube}`);
            ReduceCubes(litcubes);
            console.log(`After cube reduction: `, litcubes);
        }
        else {
            // Turning off cubes. This means we should iterate all lit cubes we know about, and look to see if there is overlap with the section being turned off.
            const cubeToRemove = new Cube(d.x, d.y, d.z, d.state);
            for (let i = 0; i < litcubes.length; ++i) {
                const litCube = litcubes[i];
                const remainingCubes = SubtractCubes(litCube, cubeToRemove);
                if (remainingCubes.length) {
                    // We had to "break" apart the lit cube into segments that stay lit. Add them to the litcubes array at the end, and splice out the main lit cube
                    // we just "broke".
                    //litcubes.splice(i, 1, ...remainingCubes);
                    i--;
                }
            }
        }
    }
    // Return the master lit cube count.
    const litcount = litcubes.reduce((p, c) => p + (Math.abs(c.x[1] - c.x[0]) + Math.abs(c.y[1] - c.y[0]) + Math.abs(c.z[1] - c.z[0]) + 3), 0);
    return litcount;
}
function GetResultPart2(data) { }
function SubtractCubes(cube1, cube2) {
    // Check for overlap in x, y, and z coords.
    const xoverlaps = GetDisjoints(cube1.x, cube2.x);
    const yoverlaps = GetDisjoints(cube1.y, cube2.y);
    const zoverlaps = GetDisjoints(cube1.z, cube2.z);
    // No overlap in any dimension means the cubes are disjoint, and therefore there is no subtraction of cubes needed.
    if (xoverlaps == null && yoverlaps == null && zoverlaps == null)
        return [];
    const newcubes = [];
    let tcube = cube1.Clone();
    if (xoverlaps?.length) {
        // Cube2 somehow overlaps Cube1 along the x-axis.
        if (xoverlaps[0] == null) {
            // All of cube2 overruns cube1's x-axis. Nothing to be done here.
        }
        else {
            // We have one or more intervals to create for new cubes.
            for (let xo of xoverlaps) {
                const newcube = new Cube(xo, cube1.y, cube1.z, cube1.lit);
                console.log(`Breaking into ${newcube}`);
                newcubes.push(newcube);
            }
        }
    }
    tcube.x = cube2.x;
    if (!tcube.Equals(cube2)) {
        // Now we examine the y-axis for overlaps.
        if (yoverlaps?.length) {
            // Cube2 somehow overlaps Cube1 along the y-axis.
            if (yoverlaps[0] == null) {
                // All of cube2 overruns cube1's y-axis. Nothing to be done here.
            }
            else {
                // We have one or more intervals to create for new cubes.
                for (let yo of yoverlaps) {
                    const newcube = new Cube(tcube.x, yo, cube1.z, cube1.lit);
                    console.log(`Breaking into ${newcube}`);
                    newcubes.push(newcube);
                }
            }
        }
    }
    tcube.y = cube2.y;
    if (!tcube.Equals(cube2)) {
        // Now we examine the z-axis for overlaps.
        if (zoverlaps?.length) {
            // Cube2 somehow overlaps Cube1 along the z-axis.
            if (zoverlaps[0] == null) {
                // All of cube2 overruns cube1's z-axis. Nothing to be done here.
            }
            else {
                // We have one or more intervals to create for new cubes.
                for (let zo of zoverlaps) {
                    const newcube = new Cube(tcube.x, tcube.y, zo, cube1.lit);
                    console.log(`Breaking into ${newcube}`);
                    newcubes.push(newcube);
                }
            }
        }
    }
    return newcubes;
}
function GetDisjoints(range1, range2) {
    // If range2 does not overlap range1 at all, return null. (No disjoints needed)
    if (!(range2[1] >= range1[0] && range2[0] <= range1[1]))
        return null;
    // There's an overlap. Either it's overlapping the entire range, one of the endpoints, or it's internal to the interval.
    if (range2[0] <= range1[0] && range2[1] >= range1[0] && range2[1] < range1[1]) {
        // Range2 overlaps the beginning portion of range1, but not the entirety of range1. Return only the right-section of range1 that isn't covered.
        return [[range2[1] + 1, range1[1]]];
    }
    else if (range2[0] > range1[0] && range2[0] <= range1[1] && range2[1] >= range1[1]) {
        // Range2 overlaps the ending portion of range1, but not the entirety of range1. Return only the left-section of range1 that isn't covered.
        return [[range1[0], range2[0] - 1]];
    }
    else if (range2[0] <= range1[0] && range2[1] >= range1[1]) {
        // Range2 completely overlaps range1. Return an empty range.
        return [[null, null]];
    }
    else {
        // Range2 covers only an internal segment of range1 (not including either endpoint). Return 2 disjointed segments of range1 that aren't including range2.
        return [
            [range1[0], range2[0] - 1],
            [range2[1] + 1, range1[1]],
        ];
    }
}
function ReduceCubes(cubes) {
    for (let i = 0; i < cubes.length; ++i) {
        const cube1 = cubes[i];
        console.log(`Cube #1: ${cube1}`);
        for (let j = i + 1; j < cubes.length; ++j) {
            const cube2 = cubes[j];
            console.log(`Cube #2: ${cube2}`);
            // Subtract cube2 from cube1. If there is an intersection, this call will return replacement, smaller cuboids to replace cube1 with.
            const c1replacements = SubtractCubes(cube1, cube2);
            if (c1replacements?.length) {
                // We found replacements. Splice out cube 1 from the array, replace with the returned replacements, and then decrement i proceed with scanning.
                cubes.splice(i, 1, ...c1replacements);
                i--;
            }
        }
    }
}
Run();
//# sourceMappingURL=index.js.map