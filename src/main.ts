import { Assets, Application } from "pixi.js";
import { assets } from "./assets";
import { TitleScene } from "./ui/titleScene";
import { GameScene } from "./ui/gameScene";


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

    // texture 불러오기
    const cardTextures = {
        ready: await Assets.load(assets.image.ready),
        selected: await Assets.load(assets.image.selected),
        correct: await Assets.load(assets.image.correct),
        wrong: await Assets.load(assets.image.wrong),
    }

    // 화면 연결
    const menu = new TitleScene(
        {startAudioList}, 
        () => {
            app.stage.removeChildren();
            const game = new GameScene(
                cardTextures, correctAudioList, wrongAudioList,
                () => {
                    app.stage.removeChildren();
                    app.stage.addChild(menu);
                },
            );
            app.stage.addChild(game);
    });

    // 화면 보이기
    app.stage.addChild(menu);
})();