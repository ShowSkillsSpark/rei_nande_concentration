import { Sprite, Texture, Assets } from "pixi.js";
import { assets } from "../assets";
import { store } from "../store";

export enum CardState {
    Ready = 'ready',
    Selected = 'selected',
    Correct = 'correct',
    Wrong = 'wrong',
}

interface CardParam { x: number, y: number, width: number, height: number, cardIndex: number, readyTexture: Texture };
export class Card extends Sprite {
    _state: CardState;
    _voiceId: number;
    _audio: HTMLAudioElement;

    constructor(
        { x, y, width, height, cardIndex, readyTexture }: CardParam,
        voiceId: number,
    ) {
        super(readyTexture);

        this._state = CardState.Ready;
        this._voiceId = voiceId;
        this._audio = new Audio(assets.sound[store.voiceType][voiceId]);

        const lesser = Math.min(width, height);
        const cardSize = lesser * 0.9;
        this.x = x + (width - cardSize) / 2;
        this.y = y + (height - cardSize) / 2;
        this.setSize(cardSize, cardSize);

        this.eventMode = 'static';
        this.cursor = 'pointer';
    }

    set state (state: CardState) {
        this._state = state;
        switch (state) {
            case CardState.Ready:
                Assets.load(assets.image.ready).then((texture) => this.texture = texture);
                this.eventMode = 'static';
                this.cursor = 'pointer';
                break;
            case CardState.Selected:
                Assets.load(assets.image.selected).then((texture) => this.texture = texture);
                this.eventMode = 'passive';
                this.cursor = 'default';
                break;
            case CardState.Correct:
                Assets.load(assets.image.correct).then((texture) => this.texture = texture);
                this.eventMode = 'passive';
                this.cursor = 'default';
                break;
            case CardState.Wrong:
                Assets.load(assets.image.wrong).then((texture) => this.texture = texture);
                this.eventMode = 'passive';
                this.cursor = 'default';
                break;
        }
    }

    async setState(state: CardState) {
        this._state = state;
        switch (state) {
            case CardState.Ready:
                this.texture = await Assets.load(assets.image.ready);
                this.eventMode = 'static';
                this.cursor = 'pointer';
                break;
            case CardState.Selected:
                this.texture = await Assets.load(assets.image.selected);
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

    get state () {
        return this._state;
    }

    get voiceId() {
        return this._voiceId;
    }

    playAudio(callback?: () => void) {
        this._audio.onended = callback || null;
        this._audio.play();
    }
}