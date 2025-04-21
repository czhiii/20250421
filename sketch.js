let planets = []; // 儲存土星星球的資料
let isRotating = false; // 控制土星是否旋轉
const buttons = []; // 儲存按鈕資料
let activeWindow = null; // 當前顯示的小視窗內容
let currentQuestionIndex = 0; // 當前題目索引
let isAnswerCorrect = null; // 是否答對
let timer = null; // 計時器
let iframeElement = null; // 儲存目前的 iframe 元素

const questions = [
    {
        question: "1. Visual Studio Code 是由哪家公司開發的？",
        options: ["A. Google", "B. Microsoft", "C. Apple", "D. Adobe"],
        answer: 1 // 答案索引 (B)
    },
    {
        question: "2. 哪一種副檔名代表 Visual Studio Code 的擴充功能（Extension）檔案？",
        options: ["A. .vscode", "B. .exe", "C. .vsix", "D. .ext"],
        answer: 2 // 答案索引 (C)
    },
    {
        question: "3. 在 VS Code 中，哪個快捷鍵可以打開整合式終端機（Integrated Terminal）？",
        options: [
            "A. Ctrl + Shift + T",
            "B. Ctrl + `（鍵盤左上角的反引號）",
            "C. Ctrl + Alt + T",
            "D. Alt + Shift + N"
        ],
        answer: 1 // 答案索引 (B)
    }
];

function setup() {
    createCanvas(windowWidth, windowHeight); // 設定全螢幕畫布
    background(0, 0, 128); // 深藍色背景 (RGB: 0, 0, 128)
    noLoop(); // 初始狀態只繪製一次

    // 初始化按鈕
    const buttonLabels = ["自我介紹", "作品", "筆記", "測驗題目", "教學影片"];
    for (let i = 0; i < buttonLabels.length; i++) {
        buttons.push({
            x: 20, // 按鈕的 X 座標
            y: 20 + i * 50, // 按鈕的 Y 座標，依序排列
            width: 120, // 按鈕寬度
            height: 40, // 按鈕高度
            label: buttonLabels[i] // 按鈕標籤
        });
    }

    // 初始化土星星球
    const planetCount = 20; // 增加土星星球數量
    for (let i = 0; i < planetCount; i++) {
        const size = random(50, 100); // 土星大小範圍 (50 ~ 100)
        let x, y;
        do {
            x = random(width); // 隨機 X 座標
            y = random(height); // 隨機 Y 座標
        } while (x < 160 && y < 300); // 確保土星不會出現在選單區域 (160x300)

        planets.push({
            x: x,
            y: y,
            size: size, // 土星大小
            ringSize: size * random(1.5, 2), // 土星環大小為土星大小的 1.5 ~ 2 倍
            rotationSpeed: random(0.001, 0.005) // 旋轉速度
        });
    }
}

function draw() {
    background(0, 0, 128); // 深藍色背景

    // 繪製星星
    const starCount = 150; // 星星數量
    for (let i = 0; i < starCount; i++) {
        const x = random(width); // 隨機 X 座標
        const y = random(height); // 隨機 Y 座標
        const size = random(1, 3); // 星星大小 (1px ~ 3px)
        noStroke();
        fill(255); // 白色星星
        ellipse(x, y, size, size); // 繪製星星
    }

    // 繪製土星星球
    for (let planet of planets) {
        push();
        translate(planet.x, planet.y); // 移動到土星的位置
        if (isRotating) {
            rotate(-frameCount * planet.rotationSpeed); // 逆時針旋轉
        }
        noStroke();

        // 繪製土星本體
        fill(255, 204, 153); // 柔和的橙色
        ellipse(0, 0, planet.size, planet.size);

        // 繪製土星環
        fill(255, 182, 193, 150); // 柔和的粉色，帶透明度
        ellipse(0, 0, planet.ringSize, planet.size / 2.5); // 土星環比例更協調
        pop();
    }

    // 繪製按鈕
    for (let button of buttons) {
        fill(255, 182, 193); // 粉色按鈕
        stroke(255); // 白色邊框
        strokeWeight(2);
        rect(button.x, button.y, button.width, button.height, 10); // 圓角矩形按鈕
        noStroke();
        fill(0); // 黑色文字
        textSize(16);
        textAlign(CENTER, CENTER);
        text(button.label, button.x + button.width / 2, button.y + button.height / 2); // 按鈕文字
    }

    // 如果有小視窗，繪製小視窗
    if (activeWindow) {
        fill(255, 240, 245, 230); // 柔和的淡粉色背景，帶透明度
        stroke(255, 182, 193); // 粉色邊框
        strokeWeight(4);
        rect(width / 2 - 350, height / 2 - 250, 700, 500, 20); // 圓角矩形視窗

        if (activeWindow === "教學影片") {
            // 嵌入影片
            const iframeX = width / 2 - 330;
            const iframeY = height / 2 - 230;
            const iframeWidth = 660;
            const iframeHeight = 460;

            if (!iframeElement) {
                iframeElement = createIframe(
                    "https://cfchen58.synology.me/%E7%A8%8B%E5%BC%8F%E8%A8%AD%E8%A8%882024/B2/week5/20250317_103952.mp4",
                    iframeX,
                    iframeY,
                    iframeWidth,
                    iframeHeight
                );
            }
        } else if (activeWindow === "筆記") {
            // 嵌入 HackMD 筆記
            const iframeX = width / 2 - 330;
            const iframeY = height / 2 - 230;
            const iframeWidth = 660;
            const iframeHeight = 460;

            if (!iframeElement) {
                iframeElement = createIframe(
                    "https://hackmd.io/iHNf8hlBSyaqJ_5beJCNaw",
                    iframeX,
                    iframeY,
                    iframeWidth,
                    iframeHeight
                );
            }
        } else if (activeWindow === "作品") {
            // 嵌入作品
            const iframeX = width / 2 - 330;
            const iframeY = height / 2 - 230;
            const iframeWidth = 660;
            const iframeHeight = 460;

            if (!iframeElement) {
                iframeElement = createIframe(
                    "https://czhiii.github.io/20250317/",
                    iframeX,
                    iframeY,
                    iframeWidth,
                    iframeHeight
                );
            }
        } else if (activeWindow === "測驗題目") {
            const question = questions[currentQuestionIndex];
            textSize(22);
            textAlign(CENTER, CENTER);
            fill(30, 30, 120); // 深藍色文字
            text(question.question, width / 2, height / 2 - 180); // 顯示題目

            // 顯示選項
            for (let i = 0; i < question.options.length; i++) {
                const optionY = height / 2 - 120 + i * 50;
                fill(255); // 白色背景
                stroke(0); // 黑色邊框
                rect(width / 2 - 280, optionY - 25, 560, 50, 10); // 選項框
                fill(0); // 黑色文字
                noStroke();
                text(question.options[i], width / 2, optionY); // 顯示選項文字
            }

            // 如果已回答，顯示正確或錯誤
            if (isAnswerCorrect !== null) {
                fill(isAnswerCorrect ? "green" : "red");
                text(
                    isAnswerCorrect ? "正確！" : "錯誤！",
                    width / 2,
                    height / 2 + 180
                );
            }
        } else {
            fill(30, 30, 120); // 深藍色文字
            textSize(22);
            textAlign(CENTER, CENTER);
            text(activeWindow, width / 2, height / 2); // 顯示其他內容
        }
    } else {
        // 如果沒有小視窗，移除 iframe
        if (iframeElement) {
            iframeElement.remove();
            iframeElement = null;
        }
    }
}

function createIframe(url, x, y, width, height) {
    const iframe = createElement("iframe");
    iframe.attribute("src", url);
    iframe.attribute("width", width);
    iframe.attribute("height", height);
    iframe.attribute("frameborder", "0");
    iframe.attribute("allowfullscreen", "true");
    iframe.position(x, y);
    return iframe;
}

function mousePressed() {
    if (activeWindow === "測驗題目") {
        const question = questions[currentQuestionIndex];
        for (let i = 0; i < question.options.length; i++) {
            const optionY = height / 2 - 10 + i * 30;
            if (
                mouseX > width / 2 - 150 &&
                mouseX < width / 2 + 150 &&
                mouseY > optionY - 15 &&
                mouseY < optionY + 15
            ) {
                isAnswerCorrect = i === question.answer; // 檢查答案是否正確
                redraw();

                // 設定三秒後切換到下一題
                clearTimeout(timer);
                timer = setTimeout(() => {
                    currentQuestionIndex++;
                    isAnswerCorrect = null;

                    if (currentQuestionIndex >= questions.length) {
                        activeWindow = "測驗結束！";
                        currentQuestionIndex = 0; // 重置題目索引
                    }
                    redraw();
                }, 3000);
                return;
            }
        }
    } else if (activeWindow) {
        // 如果有小視窗，點擊時關閉
        activeWindow = null;
        redraw();
        return;
    }

    // 檢查是否點擊了按鈕
    for (let button of buttons) {
        if (
            mouseX > button.x &&
            mouseX < button.x + button.width &&
            mouseY > button.y &&
            mouseY < button.y + button.height
        ) {
            if (button.label === "自我介紹") {
                activeWindow = "嗨嚕你好，我是教科系413730366張芷瑄"; // 自我介紹內容
            } else if (button.label === "測驗題目") {
                activeWindow = "測驗題目";
                redraw();
            } else if (button.label === "教學影片") {
                activeWindow = "教學影片"; // 顯示教學影片視窗
                redraw();
            } else if (button.label === "筆記") {
                activeWindow = "筆記"; // 顯示筆記視窗
                redraw();
            } else if (button.label === "作品") {
                activeWindow = "作品"; // 顯示作品視窗
                redraw();
            } else {
                activeWindow = `顯示內容: ${button.label}`; // 其他按鈕的內容
            }
            redraw();
            return;
        }
    }
}

function mouseMoved() {
    isRotating = true; // 當滑鼠移動時啟動旋轉
    loop(); // 開始連續繪製
}

function mouseReleased() {
    isRotating = false; // 當滑鼠停止移動時停止旋轉
    noLoop(); // 停止連續繪製
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight); // 當視窗大小改變時調整畫布
    draw(); // 重新繪製畫面
}