import { Sprite, Texture } from "pixi.js";
import { sound } from "@pixi/sound";
import { store } from "../store";

export enum CardState {
    Ready = 'ready',
    Selected = 'selected',
    Correct = 'correct',
    Wrong = 'wrong',
    Finish = 'finish',
}

interface CardParam { x: number, y: number, width: number, height: number, readyTexture: Texture, voiceName: string };
export class Card extends Sprite {
    private _state: CardState;
    private _voiceName: string;

    constructor(
        { x, y, width, height, readyTexture, voiceName }: CardParam,
    ) {
        super(readyTexture);

        this._state = CardState.Ready;
        this._voiceName = voiceName;

        const lesser = Math.min(width, height);
        const cardSize = lesser * 0.9;
        this.x = x + (width - cardSize) / 2;
        this.y = y + (height - cardSize) / 2;
        this.setSize(cardSize, cardSize);

        this.eventMode = 'static';
        this.cursor = 'pointer';
    }

    async setState(state: CardState, callback: () => void = () => {}) {
        if (this._state == CardState.Finish) return;
        this._state = state;
        switch (state) {
            case CardState.Ready:
                this.texture = await store.loadImage(store.IMAGE.READY);
                this.eventMode = 'static';
                this.cursor = 'pointer';
                break;
            case CardState.Selected:
                this.texture = await store.loadImage(store.IMAGE.SELECTED);
                sound.play(this.voiceName, callback);
                this.eventMode = 'passive';
                this.cursor = 'default';
                break;
            case CardState.Correct:
                this.texture = await store.loadImage(store.IMAGE.CORRECT);
                this.eventMode = 'passive';
                this.cursor = 'default';
                break;
            case CardState.Wrong:
                this.texture = await store.loadImage(store.IMAGE.WRONG);
                this.eventMode = 'passive';
                this.cursor = 'default';
                break;
            case CardState.Finish:
                this.texture = await store.loadImage(store.IMAGE.FINISH);
                this.eventMode = 'passive';
                this.cursor = 'default';
                break;
        }
    }

    async playSound(callback: () => void = () => {}) {
        sound.play(this._voiceName, callback);
    }

    get state () { return this._state; }
    get voiceName() { return this._voiceName; }
}