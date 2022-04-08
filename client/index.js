const createBoard = (canvas, cell) => {
    const ctx = canvas.getContext('2d');
    const size = Math.floor(canvas.width / cell);

    const drawBoard = board => {
        board.forEach((row, y) => {
            row.forEach((color, x) => color && fillCell(x, y, color));
        });
    }

    const fillCell = (x, y, color) => {
        ctx.fillStyle = color;
        ctx.fillRect(x * size, y * size, 5, 5); // cell / 20
    }

    const getCellCoordinates = (x, y) => ({
        x: Math.floor(x / size),
        y: Math.floor(y / size)
    });

    return { drawBoard, fillCell, getCellCoordinates }
}

const getClickCoordinates = (canvas, e) => {
    const { top, left } = canvas.getBoundingClientRect();
    const { clientX, clientY } = e;
    return {
        x: clientX - left,
        y: clientY - top
    }
}

(parseCookie = () => {
    const now = new Date().getTime();
    if (!document.cookie) document.cookie = `timestamp=${now}`;
    const timestamp = Number(document.cookie.substring(10));
    let delay = Math.abs((new Date(timestamp) - new Date(now)) / 1000 / 60); //
    if (delay >= 5) return true;
    delay = delay.toFixed(2).split('.');
    let minutes = `0${4 - delay[0]}`;
    let seconds = 60 - Math.floor(delay[1] / 100 * 59);
    if (seconds < 10) seconds = `0${seconds}`;
    document.querySelector('span').innerText = `${minutes}:${seconds}`;
    return false;
})();

const updateCookie = () => document.cookie = `timestamp=${new Date().getTime()}`;

(() => {
    setInterval(() => parseCookie(), 1000);

    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let color = '#000';
    document.querySelector('input').addEventListener('change', e => color = e.target.value);
    const { drawBoard, fillCell, getCellCoordinates } = createBoard(canvas, 100);
    const socket = io();

    const onClick = e => {
        if (!parseCookie()) return;
        const { x, y } = getClickCoordinates(canvas, e);
        socket.emit('fill', { ...getCellCoordinates(x, y), color });
        updateCookie();
    }
    canvas.addEventListener('click', onClick);
    socket.on('fill', fillCell);
    socket.on('board', drawBoard);
})();