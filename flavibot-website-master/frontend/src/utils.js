export function animateValue(ref, end, totalTime) {
    let start = ref.count;
    let neg = end < start;
    let range = neg ? start - end : end - start
    let increment = 0;
    let loopDuration = 0;
    while (loopDuration < 4) {
        increment += 1
        loopDuration = Math.abs(totalTime / (range / increment))
    }
    const interval = setInterval(() => {
        if (ref.count === end) clearInterval(interval)
        else ref.count = (neg) ? (ref.count - increment) : (ref.count + increment)
    }, loopDuration)
}

export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
