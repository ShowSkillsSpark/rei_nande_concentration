import { Text } from "pixi.js";
import { FancyButton } from "@pixi/ui";
import { Scene, SceneParam } from "./scene";
import { fitToParent } from "../util";

// UI
// 게임 클리어!
// 설정1 설정2
// 점수
// 타이틀로 돌아가기
interface ClearSceneParam extends SceneParam {};
export class ClearScene extends Scene {
    constructor(param: ClearSceneParam) {
        super(param);

        const clearText = new Text({
            text: '게임 클리어!',
            style: {
                fontFamily: 'JalnanOTF00',
                fontSize: 200,
            }
        });
        clearText.anchor.set(0.5);
        fitToParent(clearText, this.sceneWidth * 0.6, this.sceneHeight * 0.2);
        clearText.x = this.horizontal_center;
        clearText.y = this.sceneY + this.sceneHeight * 0.2;

        const backButtonDefaultView = new Text({
            text: '타이틀로 돌아가기',
            style: {
                fontFamily: 'Ownglyph StudyHard Rg',
                fontSize: 100,
            }
        });
        const backButtonHoverView = new Text({
            text: '타이틀로 돌아가기',
            style: {
                fontFamily: 'Ownglyph StudyHard Rg',
                fontSize: 100,
                fill: 'red',
            }
        });
        const backButton = new FancyButton({
            defaultView: backButtonDefaultView,
            hoverView: backButtonHoverView,
            animations: {
                hover: {
                    props: {
                        scale: { x: 1.1, y: 1.1 },
                    },
                    duration: 100,
                }
            }
        });
        backButton.anchor.set(0.5);
        fitToParent(backButton, this.sceneWidth, this.sceneHeight * 0.1);
        backButton.x = this.horizontal_center;
        backButton.y = this.sceneHeight * 0.8;
        backButton.onclick = () => {
            param.navigator.navScene(param.navigator.SCENE.TITLE);
        }

        this.scene.addChild(clearText);
        this.scene.addChild(backButton);
    }

    onNavigated(): void {
        // 소리: 빰빠카빰, 하나비라 다이스키, 결혼해줄래? 등
    }
}