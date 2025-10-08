const symbols = [
    "watermelon",
    "cherry",
    "lemon",
    "bell",
    "bar-single",
    "bar-double",
    "bar-triple",
    "seven-white",
    "seven-blue",
    "seven-red",
]

class Reel {
    constructor(reelSelector) {
        this.reel = document.querySelector(reelSelector);
        this.reset();
        this.resolve_status = true;
    }

    reset() {
        this.maxRepeats = Math.floor(Math.random() * (20 + 1)) + 30;
        this.count = 0;
        this.timing = 0.08;
    }

    shiftItems() {
        const last = this.reel.lastElementChild;
        this.reel.insertBefore(last, this.reel.firstElementChild);
    }

    runAnimation() {
        return new Promise((resolve) => {
            if (this.count > this.maxRepeats - 20) this.timing *= 1.05;

            this.reel.style.animation = "none";
            void this.reel.offsetWidth;
            this.reel.style.animation = `moveDown ${this.timing}s linear`;

            this.reel.addEventListener(
                "animationend",
                () => {
                this.count++;
                this.shiftItems();

                // console.log("repeatition count: " + this.count);
                if (this.count < this.maxRepeats) {
                    resolve(false);
                    this.resolve_status =  false;
                } else {
                    this.reel.style.animationPlayState = "paused";
                    this.reset();
                    resolve(true);
                    this.resolve_status = true;
                }
                },
                { once: true }
            );
        });
    }

    async spin(callback = () => {} ) {
        let done = false;
        while (!done) {
            done = await this.runAnimation();
        }
        callback()
    }
}

const wrapper = document.querySelector('.lever-wrapper');
wrapper.addEventListener('click', () => {
    runAllThree();
    rotateLever();
});

const img = document.querySelector('.lever');

function rotateLever() {
    img.style.transform = 'rotate(90deg)';
}

function resetLever() {
    img.style.transform = 'rotate(0deg)';
}


function checkwin() {
    resetLever();

    let winning = [];
    for (let i = 0; i < 3; i++) {
        let symbols = document.querySelector(".reel" + (i + 1)).children;
        winning.push(symbols[2].firstElementChild.id);
    }

    console.log(winning);
}

const reel1 = new Reel(".reel1");
const reel2 = new Reel(".reel2");
const reel3 = new Reel(".reel3");

function runAllThree() {
    if (!reel3.resolve_status) {
        console.log("still spinning, wait til don")
        return;
    }

    // offset to make the latter spin later
    reel2.maxRepeats = reel2.maxRepeats + Math.floor(Math.random() * (20 - 15 + 1)) + 15;
    reel3.maxRepeats = reel2.maxRepeats + Math.floor(Math.random() * (20 - 15 + 1)) + 15;

    reel1.spin();
    reel2.spin();
    reel3.spin(checkwin);
}