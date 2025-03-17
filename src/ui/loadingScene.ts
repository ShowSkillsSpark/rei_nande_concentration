import { Assets, Text, TextStyle } from "pixi.js";
import { store } from "../store";
import { Scene, SceneParam } from "./scene";

export class LoadingScene extends Scene {
    private _baseText;
    constructor(param: SceneParam) {
        super(param);

        this._baseText = '목소리를 가다듬는 중';
        const loadingText = new Text({
            text: `${this._baseText}`,
            style: new TextStyle({
                fontSize: 100,
            })
        });
        loadingText.x = (this.sceneWidth - loadingText.width) / 2;
        loadingText.y = (this.sceneHeight - loadingText.height) / 2;
        this.scene.addChild(loadingText);

        let dotCount = 0;
        setInterval(() => {
            dotCount = (dotCount + 1) % 4;
            loadingText.text = `${this._baseText}` + '.'.repeat(dotCount);
        }, 500);
        this.scene.addChild(loadingText);
    }

    onNavigated = () => {}
    onUnnavigated = () => {}

    async loading() {
        store.loadRandomVoice(store.VOICE.CHAOS, -1);
        this._baseText = '방송 제목을 바꾸는 중';
        await Assets.load('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_four@1.2/JalnanOTF00.woff');
        await Assets.load('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/ChosunGs.woff');
        await Assets.load('https://fastly.jsdelivr.net/gh/projectnoonnu/2411-3@1.0/Ownglyph_StudyHard-Rg.woff2');
        await Assets.load('https://fastly.jsdelivr.net/gh/projectnoonnu/2410-1@1.0/GumiRomanceTTF.woff2');
        await Assets.load('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2402_keris@1.0/TTHakgyoansimNamuL.woff2');
    }
}