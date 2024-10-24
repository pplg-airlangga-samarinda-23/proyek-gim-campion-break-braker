var canvas = document.getElementById("canvas1");
var ctx = canvas.getContext("2d");

var x, y, dx, dy, skor, nyawa, batuBata;
var ballRadius = 5;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX;
var kananDitekan = false;
var kiriDitekan = false;
var barisBatuBata = 8;
var kolomBatuBata = 9;
var lebarBatuBata = 60;
var tinggiBatuBata = 20;
var jarakBatuBata = 10;
var jarakAtasBatuBata = 30;
var jarakKiriBatuBata = 35;
var skorTertinggi = localStorage.getItem("skorTertinggi") || 0;

var warnaBatuBata = ["#FF5733", "#33FF57", "#3357FF", "#F4D03F", "#8E44AD", "#3498DB", "#E74C3C", "#1ABC9C"];
var partikel = [];
var efekRipple = [];
var lastPaddleX = paddleX;
var trail = [];

document.addEventListener("keydown", tekanTombolBawah);
document.addEventListener("keyup", lepasTombol);
document.addEventListener("mousemove", gerakMouse);

function inisialisasiBatuBata() {
    batuBata = [];
    for (let c = 0; c < kolomBatuBata; c++) {
        batuBata[c] = [];
        for (let r = 0; r < barisBatuBata; r++) {
            batuBata[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}

function resetPermainan() {
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 2;
    dy = -2;
    skor = 0;
    nyawa = 3;
    paddleX = (canvas.width - paddleWidth) / 2;
    lastPaddleX = paddleX;
    inisialisasiBatuBata();
}

function mulaiPermainan() {
    document.getElementById("mainMenu").style.display = "none";
    canvas.style.display = "block";
    resetPermainan();
    requestAnimationFrame(gambar);
}

document.getElementById("startButton").addEventListener("click", mulaiPermainan);
document.getElementById("highScoreDisplay").innerText = "Skor Tertinggi: " + skorTertinggi;

function tekanTombolBawah(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        kananDitekan = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        kiriDitekan = true;
    }
}

function lepasTombol(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        kananDitekan = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        kiriDitekan = false;
    }
}

function gerakMouse(e) {
    var relatifX = e.clientX - canvas.offsetLeft;
    if (relatifX > paddleWidth / 2 && relatifX < canvas.width - paddleWidth / 2) {
        paddleX = relatifX - paddleWidth / 2;
    }
}

function gambarBatuBata() {
    for (let c = 0; c < kolomBatuBata; c++) {
        for (let r = 0; r < barisBatuBata; r++) {
            if (batuBata[c][r].status === 1) {
                var batuBataX = c * (lebarBatuBata + jarakBatuBata) + jarakKiriBatuBata;
                var batuBataY = r * (tinggiBatuBata + jarakBatuBata) + jarakAtasBatuBata;
                batuBata[c][r].x = batuBataX;
                batuBata[c][r].y = batuBataY;
                ctx.beginPath();
                ctx.rect(batuBataX, batuBataY, lebarBatuBata, tinggiBatuBata);
                ctx.fillStyle = warnaBatuBata[r % warnaBatuBata.length];
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function deteksiTabrakan() {
    for (let c = 0; c < kolomBatuBata; c++) {
        for (let r = 0; r < barisBatuBata; r++) {
            var b = batuBata[c][r];
            if (b.status === 1) {
                if (x > b.x && x < b.x + lebarBatuBata && y > b.y && y < b.y + tinggiBatuBata) {
                    dy = -dy;
                    b.status = 0;
                    skor++;
                    buatPartikel(b.x + lebarBatuBata / 2, b.y + tinggiBatuBata / 2);
                    if (skor === barisBatuBata * kolomBatuBata) {
                        perbaruiSkorTertinggi();
                        alert("Selamat, Anda Menang!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function buatPartikel(x, y) {
    for (let i = 0; i < 10; i++) {
        partikel.push({
            x: x,
            y: y,
            dx: (Math.random() - 0.5) * 4,
            dy: (Math.random() - 0.5) * 4,
            radius: Math.random() * 3 + 1,
            alpha: 1
        });
    }
}

function buatRipple(x) {
    efekRipple.push({
        x: x,
        y: canvas.height - paddleHeight,
        radius: 0,
        alpha: 0.6
    });
}

function gambarPartikel() {
    partikel.forEach((p, index) => {
        if (p.alpha <= 0) {
            partikel.splice(index, 1);
        } else {
            p.x += p.dx;
            p.y += p.dy;
            p.alpha -= 0.02;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
            ctx.fill();
            ctx.closePath();
        }
    });
}

function gambarRipple() {
    efekRipple.forEach((r, index) => {
        if (r.alpha <= 0) {
            efekRipple.splice(index, 1);
        } else {
            r.radius += 2;
            r.alpha -= 0.02;

            ctx.beginPath();
            ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0, 250, 154, ${r.alpha})`;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();
        }
    });
}

function perbaruiSkorTertinggi() {
    if (skor > skorTertinggi) {
        skorTertinggi = skor;
        localStorage.setItem("skorTertinggi", skorTertinggi);
        document.getElementById("highScoreDisplay").innerText = "Skor Tertinggi: " + skorTertinggi;
    }
}

function gambarTrail() {
    trail.forEach((t, index) => {
        t.alpha -= 0.03;
        if (t.alpha <= 0) {
            trail.splice(index, 1);
        } else {
            ctx.beginPath();
            ctx.rect(t.x, canvas.height - paddleHeight, paddleWidth, paddleHeight);
            ctx.fillStyle = `rgba(0, 250, 154, ${t.alpha})`;
            ctx.fill();
            ctx.closePath();
        }
    });
}

function gambarBola() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#FFD700";
    ctx.fill();
    ctx.closePath();
}

function gambarPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#00FA9A";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "rgba(0, 250, 154, 0.5)";
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0;

    if (Math.abs(paddleX - lastPaddleX) > 5) {
        trail.push({ x: paddleX, alpha: 0.8 });
    }

    lastPaddleX = paddleX;
}

function gambarSkor() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Skor: " + skor, 8, 20);
}

function gambarNyawa() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Nyawa: " + nyawa, canvas.width - 75, 20);
}

function gambar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gambarLatarBelakang();
    gambarBatuBata();
    gambarRipple();
    gambarPartikel();
    gambarTrail();
    gambarBola();
    gambarPaddle();
    gambarSkor();
    gambarNyawa();
    deteksiTabrakan();

    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            buatRipple(x);
        } else {
            nyawa--;
            if (!nyawa) {
                perbaruiSkorTertinggi();
                alert("Game Over");
                document.location.reload();
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
        dx = -dx;
    }

    if (kananDitekan && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (kiriDitekan && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;

    requestAnimationFrame(gambar);
}

function gambarLatarBelakang() {
    var gradasi = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradasi.addColorStop(0, "#000428");
    gradasi.addColorStop(1, "#004e92");
    ctx.fillStyle = gradasi;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
