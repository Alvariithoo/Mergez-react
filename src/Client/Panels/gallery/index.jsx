import React from 'react'

export function Gallery() {
    function hide(event) {
        if (event.target === this) this.hide()
    }
    return (
        <>
            <div id="gallery" onClick={hide} style={{ display: "none" }}>
                <div id="gallery-content">
                    <div id="gallery-header">Skins</div>
                    <div id="gallery-body" />
                </div>
            </div>
        </>
    )
}