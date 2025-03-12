export const store = new class {
    // voice type
    _availableVoiceTypeList: string[] = ['nande'];
    _voiceTypeIndex = 0;

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
    _availableCardCountList: number[] = [2, 4];
    _cardCountIndex = 0;

    get cardCount() { return this._availableCardCountList[this._cardCountIndex]; }
    get cardCountString() {
        return `${this.cardCount} x ${this.cardCount}`;
    }
    nextCardCount() { this._cardCountIndex = (this._cardCountIndex + 1) % this._availableCardCountList.length; }
}();