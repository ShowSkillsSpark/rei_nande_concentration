import { Assets, Application } from "pixi.js";
import { assets } from "./assets";
import { TitleScene } from "./ui/titleScene";
import { GameScene } from "./ui/gameScene";
import { Navigator } from "./ui/navigator";


(async () => {
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({ background: "#ffe8ee", resizeTo: window });

    // Append the application canvas to the document body
    document.getElementById("pixi-container")!.appendChild(app.canvas);


    // 로딩
    // audio 불러오기
    const startAudioList = [
        new Audio(assets.sound['konrei'][0]),
        new Audio(assets.sound['konrei'][1]),
        new Audio(assets.sound['hello'][0]),
        new Audio(assets.sound['hello'][1]),
        new Audio(assets.sound['hello'][2]),
    ]
    const correctAudioList = [
        new Audio(assets.sound['thx'][0]),
        new Audio(assets.sound['thx'][1]),
        new Audio(assets.sound['thx'][2]),
        new Audio(assets.sound['thx'][3]),
        new Audio(assets.sound['thx'][4]),
        new Audio(assets.sound['yoshi'][0]),
    ]
    const wrongAudioList = [
        new Audio(assets.sound['haa'][0]),
        new Audio(assets.sound['haa'][1]),
        new Audio(assets.sound['hee'][0]),
        new Audio(assets.sound['hen'][0]),
        new Audio(assets.sound['hen'][1]),
        new Audio(assets.sound['hidoi'][0]),
        new Audio(assets.sound['kora'][0]),
        new Audio(assets.sound['kora'][1]),
        new Audio(assets.sound['sorry'][0]),
        new Audio(assets.sound['sorry'][1]),
        new Audio(assets.sound['zako'][0]),
        new Audio(assets.sound['zako'][1]),
        new Audio(assets.sound['zako'][2]),
        new Audio(assets.sound['zako'][3]),
    ]

    // 화면 연결
    const navigator = new Navigator(app);
    new TitleScene({startAudioList, navigator, sceneName: navigator.SCENE.TITLE});
    new GameScene({
        correctAudioList,
        wrongAudioList,
        navigator,
        sceneName: navigator.SCENE.GAME,
    });

    // 화면 보이기
    navigator.navScene(navigator.SCENE.TITLE);
})();