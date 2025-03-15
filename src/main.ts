import { Application, Assets } from "pixi.js";
import { TitleScene } from "./ui/titleScene";
import { GameScene } from "./ui/gameScene";
import { Navigator } from "./ui/navigator";
import { ClearScene } from "./ui/clearScene";
import { HanabiraOverlay } from "./ui/hanabiraOverlay";

(async () => {
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({ background: "#ffe8ee", resizeTo: window });

    // Append the application canvas to the document body
    document.getElementById("pixi-container")!.appendChild(app.canvas);

    // font 불러오기
    await Assets.load('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_four@1.2/JalnanOTF00.woff');
    await Assets.load('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/ChosunGs.woff');
    await Assets.load('https://fastly.jsdelivr.net/gh/projectnoonnu/2411-3@1.0/Ownglyph_StudyHard-Rg.woff2');
    await Assets.load('https://fastly.jsdelivr.net/gh/projectnoonnu/2410-1@1.0/GumiRomanceTTF.woff2');
    await Assets.load('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2402_keris@1.0/TTHakgyoansimNamuL.woff2');

    // 화면 연결
    const navigator = new Navigator(app);
    new TitleScene({
        navigator,
        sceneName: navigator.SCENE.TITLE,
    });
    new GameScene({
        navigator,
        sceneName: navigator.SCENE.GAME,
    });
    new ClearScene({
        navigator,
        sceneName: navigator.SCENE.CLEAR,
    })
    navigator.addOverlay(navigator.OVERLAY.HANABIRA, new HanabiraOverlay({app}));

    // 시작 화면
    navigator.navScene(navigator.SCENE.TITLE);
    // navigator.navScene(navigator.SCENE.GAME);
    // navigator.navScene(navigator.SCENE.CLEAR);
})();