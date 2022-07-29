class BrakeBanner {
  constructor(selector) {
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0xffffff,
      resizeTo: window,
    });

    // 画布
    document.querySelector(selector).appendChild(this.app.view);

    // 加载素材到场景中
    this.loader = new PIXI.Loader();
    this.loader.add("btn.png", "images/btn.png");
    this.loader.add("btn_circle.png", "images/btn_circle.png");
    this.loader.add("brake_bike.png", "images/brake_bike.png");
    this.loader.add("brake_handlerbar.png", "images/brake_handlerbar.png");
    this.loader.add("brake_lever.png", "images/brake_lever.png");
    this.loader.add("bg.jpeg", "images/bg.jpeg");
    this.loader.load();

    // 绑定加载完成事件
    this.loader.onComplete.add(() => {
      this.show();
    });
  }

  show() {
    // 背景
    let bgImage = new PIXI.Sprite(this.loader.resources["bg.jpeg"].texture);
    this.app.stage.addChild(bgImage);
    bgImage.scale.x = 1.4;
    bgImage.scale.y = 1.4;

    // 创建粒子
    // 创建粒子
    const particleContainer = new PIXI.Container();
    this.app.stage.addChild(particleContainer);
    particleContainer.x = window.innerWidth / 2;
    particleContainer.y = window.innerHeight / 2;
    particleContainer.pivot.x = particleContainer.x;
    particleContainer.pivot.y = particleContainer.y;
    particleContainer.rotation = (35 * Math.PI) / 180;
    const particles = [];
    const dots = [
      { x: 10, y: 10, radius: 6, color: 0x000000 },
      { x: 10, y: 200, radius: 6, color: 0x818181 },
      { x: 10, y: 400, radius: 6, color: 0xf1cf54 },
      { x: 210, y: 400, radius: 6, color: 0xb5cea8 },
      { x: 210, y: 10, radius: 6, color: 0xf1cf54 },
      { x: 210, y: 200, radius: 6, color: 0xff0000 },
      { x: 410, y: 400, radius: 6, color: 0xff0000 },
      { x: 410, y: 10, radius: 6, color: 0xff0000 },
      { x: 410, y: 200, radius: 6, color: 0xff0000 },
      { x: 610, y: 400, radius: 6, color: 0xff0000 },
      { x: 610, y: 10, radius: 6, color: 0xff0000 },
      { x: 610, y: 200, radius: 6, color: 0xff0000 },
      { x: 810, y: 400, radius: 6, color: 0xff0000 },
      { x: 810, y: 10, radius: 6, color: 0xff0000 },
      { x: 810, y: 200, radius: 6, color: 0xff0000 },
      { x: 100, y: 100, radius: 6, color: 0xffff00 },
      { x: 100, y: 300, radius: 6, color: 0xffff00 },
      { x: 300, y: 100, radius: 6, color: 0xffff00 },
      { x: 300, y: 300, radius: 6, color: 0xffff00 },
      { x: 500, y: 100, radius: 6, color: 0xffff00 },
      { x: 500, y: 300, radius: 6, color: 0xffff00 },
      { x: 700, y: 100, radius: 6, color: 0xffff00 },
      { x: 700, y: 300, radius: 6, color: 0xffff00 },
    ];
    for (let i = 0; i < dots.length; i++) {
      const gr = new PIXI.Graphics();
      const item = dots[i];
      gr.beginFill(item.color);
      gr.drawCircle(0, 0, item.radius);
      gr.endFill();
      gr.x = item.x;
      gr.y = item.y;
      particleContainer.addChild(gr);
      particles.push({ gr: gr, ...item });
    }

    let speed = 0;
    start();
    function start() {
      // 动起来
      speed = 0;
      gsap.ticker.add(loop);
    }
    function pause() {
      // 停下
      gsap.ticker.remove(loop);
      for (let i = 0; i < particles.length; i++) {
        const item = particles[i];
        const gr = item.gr;

        gr.scale.x = 1;
        gr.scale.y = 1;

        gsap.to(gr, {
          duration: 0.6,
          x: item.x,
          y: item.y,
          ease: "elastic.out",
        });
      }
    }
    function loop() {
      speed += 0.5;
      speed = Math.min(speed, 20);
      for (let i = 0; i < particles.length; i++) {
        const item = particles[i];
        const gr = item.gr;
        gr.y += speed;
        if (speed > 19) {
          gr.scale.x = 0.05;
          gr.scale.y = 40;
        }
        if (gr.y > window.innerHeight) {
          gr.y = 0;
        }
      }
    }
    // 在场景中创建一个整体容器来存放自行车，方便整体的调整。而不是直接在场景上画
    let bikeContainer = new PIXI.Container();
    this.app.stage.addChild(bikeContainer);

    bikeContainer.scale.x = bikeContainer.scale.y = 0.3;

    // 通过图片创建元素
    let bikeImage = new PIXI.Sprite(
      this.loader.resources["brake_bike.png"].texture
    );
    bikeContainer.addChild(bikeImage);

    let bikeLeverImage = new PIXI.Sprite(
      this.loader.resources["brake_lever.png"].texture
    );
    bikeContainer.addChild(bikeLeverImage);

    bikeLeverImage.pivot.x = 455;
    bikeLeverImage.pivot.y = 455;
    bikeLeverImage.x = 722;
    bikeLeverImage.y = 900;

    let bikeHandlerBarImage = new PIXI.Sprite(
      this.loader.resources["brake_handlerbar.png"].texture
    );
    bikeContainer.addChild(bikeHandlerBarImage);

    let actionButton = this.createActionButton();
    actionButton.x = actionButton.y = 300;
    this.app.stage.addChild(actionButton);

    actionButton.interactive = true;
    actionButton.buttonMode = true;
    (bikeLeverImage.rotation = (Math.PI / 180) * -12),
      actionButton.on("mousedown", () => {
        gsap.to(bikeLeverImage, {
          duration: 0.6,
          rotation: (Math.PI / 180) * -30,
        });

        pause();
      });
    actionButton.on("mouseup", () => {
      gsap.to(bikeLeverImage, {
        duration: 0.6,
        rotation: (Math.PI / 180) * -12,
      });
      start();
    });

    // 保持在画面右下角
    const resize = () => {
      bikeContainer.x = window.innerWidth - bikeContainer.width;
      bikeContainer.y = window.innerHeight - bikeContainer.height;
    };
    window.addEventListener("resize", resize);
    resize();
  }

  createParticles() {}

  createActionButton() {
    // 在场景中创建一个整体容器来存放按钮，方便整体的调整。而不是直接在场景上画
    let actionButton = new PIXI.Container();

    // 通过图片创建元素
    let btnImage = new PIXI.Sprite(this.loader.resources["btn.png"].texture);
    let btnCircle = new PIXI.Sprite(
      this.loader.resources["btn_circle.png"].texture
    );
    let btnCircle2 = new PIXI.Sprite(
      this.loader.resources["btn_circle.png"].texture
    );

    // this.app.stage.addChild(btnImage);
    // this.app.stage.addChild(btnCircle);

    actionButton.addChild(btnImage);
    actionButton.addChild(btnCircle);
    actionButton.addChild(btnCircle2);

    btnImage.pivot.x = btnImage.width / 2;
    btnImage.pivot.y = btnImage.height / 2;
    btnCircle.pivot.x = btnCircle.width / 2;
    btnCircle.pivot.y = btnCircle.height / 2;
    btnCircle2.pivot.x = btnCircle2.width / 2;
    btnCircle2.pivot.y = btnCircle2.height / 2;

    btnCircle.scale.x = btnCircle.scale.y = 0.8;
    gsap.to(btnCircle.scale, { duration: 1, x: 1.2, y: 1.2, repeat: -1 });
    gsap.to(btnCircle, { duration: 1, alpha: 0, repeat: -1 });
    return actionButton;
  }

  createBike() {}
}
