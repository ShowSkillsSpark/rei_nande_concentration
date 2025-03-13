import { Sprite, Texture, Assets } from "pixi.js";
import { assets } from "../assets";
import { sound } from "@pixi/sound";

export enum CardState {
    Ready = 'ready',
    Selected = 'selected',
    Correct = 'correct',
    Wrong = 'wrong',
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
        this._state = state;
        switch (state) {
            case CardState.Ready:
                this.texture = await Assets.load(assets.image.ready);
                this.eventMode = 'static';
                this.cursor = 'pointer';
                break;
            case CardState.Selected:
                this.texture = await Assets.load(assets.image.selected);
                sound.play(this.voiceName, callback);
                this.eventMode = 'passive';
                this.cursor = 'default';
                break;
            case CardState.Correct:
                this.texture = await Assets.load(assets.image.correct);
                this.eventMode = 'passive';
                this.cursor = 'default';
                break;
            case CardState.Wrong:
                this.texture = await Assets.load(assets.image.wrong);
                this.eventMode = 'passive';
                this.cursor = 'default';
                break;
        }
    }

    get state () { return this._state; }
    get voiceName() { return this._voiceName; }
}