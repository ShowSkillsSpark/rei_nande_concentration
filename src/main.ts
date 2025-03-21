import { Application } from "pixi.js";
import { TitleScene } from "./ui/titleScene";
import { GameScene } from "./ui/gameScene";
import { Navigator } from "./ui/navigator";
import { ClearScene } from "./ui/clearScene";
import { HanabiraOverlay } from "./ui/hanabiraOverlay";
import { LoadingScene } from "./ui/loadingScene";
import { version } from "../package.json";

(async () => {
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({ background: "#ffe8ee", resizeTo: window, antialias: true });

    // Append the application canvas to the document body
    document.getElementById("pixi-container")!.appendChild(app.canvas);
    
    console.log(`version: ${version}`);

    // 화면 연결
    const navigator = new Navigator(app);
    const loadingScene = new LoadingScene({
        navigator,
        sceneName: navigator.SCENE.LOADING,
    });
    navigator.navScene(navigator.SCENE.LOADING);
    await loadingScene.loading();

    console.log('억까 신고는 https://cafe.naver.com/virtualidol/2988 에 댓글로 부탁드립니다.');

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