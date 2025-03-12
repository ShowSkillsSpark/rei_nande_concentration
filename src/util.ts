import { Container } from "pixi.js";

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export const shuffle = (array: any[]) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
}

export const fitToParent = (child: Container, parentWidth: number, parentHeight: number) => {
    if (child.width / child.height > parentWidth / parentHeight) {
        child.height = child.height * parentWidth / child.width;
        child.width = parentWidth;
    } else {
        child.width = child.width * parentHeight / child.height;
        child.height = parentHeight;
    }
}