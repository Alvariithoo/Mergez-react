class Color {
    static fromHex(color) {
        let hex = color
        if (color.startsWith('#')) hex = color.slice(1)
        if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('')
        if (hex.length !== 6) throw new Error(`Invalid color ${color}`)
        const v = parseInt(hex, 16)
        return new Color((v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF, `#${hex}`)
    }
    constructor(r, g, b, hex) {
        this.r = r
        this.g = g
        this.b = b
        this.hexCache = hex
    }
    clone() {
        return new Color(this.r, this.g, this.b)
    }
    toHex() {
        if (this.hexCache) return this.hexCache
        return this.hexCache = `0x${((1 << 24) | (this.r << 16) | (this.g << 8) | this.b).toString(16).slice(1)}`
    }
}

export default Color