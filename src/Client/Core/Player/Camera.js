class PlayerCamera {
    static camera = {
        x: 0,
        y: 0,
        nx: 0,
        ny: 0,
        target: {
            x: 0,
            y: 0,
            scale: 1
        },
        viewportScale: 1,
        userZoom: 1,
        sizeScale: 1,
        scale: 1,
        updated: 0,
        oldPos: {
            x: 0,
            y: 0
        }
    }
}

export default PlayerCamera