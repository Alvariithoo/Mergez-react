import React from 'react'

function Welcome() {
    return (
        <>
            <div className="ver-align opac0">
                <h2 className="loader-text">Welcome to Mergez</h2>
                <div id="featured-video">
                    <iframe 
                        width={660} 
                        height={315} 
                        title="Featured Video" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen="" 
                    />
                </div>
                
                <button className="btn btn-danger btn-success" id="skip">skip</button>
            </div>
        </>
    )
}

export default Welcome