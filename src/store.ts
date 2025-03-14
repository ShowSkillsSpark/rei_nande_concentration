import { sound } from "@pixi/sound";
import { assets } from "./assets";
import { shuffle } from "./util";
import { Ticker } from "pixi.js";

export const store = new class {
    // voice type
    private _availableVoiceTypeList: string[] = ['nande'];
    private _voiceTypeIndex = 0;

    get voiceType() { return this._availableVoiceTypeList[this._voiceTypeIndex]; }
    get voiceTypeString() {
        switch(this.voiceType) {
            case 'nande': return '난데';
            default: return 'ERROR';
        }
    }
    nextVoiceType() {
        this._voiceTypeIndex = (this._voiceTypeIndex + 1) % this._availableVoiceTypeList.length;
    }

    // card count
    private _availableCardCountList: number[] = [2, 4];
    private _cardCountIndex = 0;

    get cardCount() { return this._availableCardCountList[this._cardCountIndex]; }
    get cardCountString() {
        return `${this.cardCount} x ${this.cardCount}`;
    }
    nextCardCount() { this._cardCountIndex = (this._cardCountIndex + 1) % this._availableCardCountList.length; }

    // game logic
    private _voiceIdList: number[] = [];

    get voiceIdList() { return this._voiceIdList; }
    get newVoiceIdList() {
        // 사용할 음성 선택
        let voiceIdList = Object.keys(assets.sound[store.voiceType]).map(Number);
        for (const voiceId of voiceIdList) {
            if (sound.exists(`${store.voiceType}-${voiceId}`)) continue;
            sound.add(`${store.voiceType}-${voiceId}`, assets.sound[store.voiceType][voiceId]);
        }

        // 카드 배치
        voiceIdList = shuffle(voiceIdList).slice(0, store.cardCount * store.cardCount / 2);
        voiceIdList = voiceIdList.concat(voiceIdList);
        voiceIdList = shuffle(voiceIdList);

        // 초기화
        this._voiceIdList = voiceIdList;
        return this._voiceIdList;
    }

    // timer
    private _startDate: Date | null = null;
    private _endDate: Date | null = null;
    private _stopTimer = false;

    onTimerUpdate?: () => void;
    private _updateTimer = () => {
        this._endDate = new Date();
        this.onTimerUpdate?.();
    }
    resetTimer() {
        this._startDate = null;
        this._endDate = null;
        this._stopTimer = false;
    }
    startTimer() {
        this._startDate = this._endDate = new Date();
        Ticker.shared.add(this._updateTimer);
    }
    stopTimer() {
        this._stopTimer = true;
        Ticker.shared.remove(this._updateTimer);
    }
    get elapsedTime() {
        const postfix = ' 초';
        if (this._startDate == null) return (0).toFixed(1) + postfix;
        if (!this._stopTimer) this._endDate = new Date();
        return ((this._endDate!!.getTime() - this._startDate.getTime()) / 1000).toFixed(1) + postfix;
    }

    // moves
    selectCount = 0;
}();