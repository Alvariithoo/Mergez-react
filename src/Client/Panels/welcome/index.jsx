import React, { useEffect } from 'react'
import $ from 'jquery'

export function Welcome() {

    useEffect(() => {
        const youtube_video = "7QGXm014K64"
        $("#featured-video iframe").attr("src", `https://www.youtube.com/embed/${youtube_video.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/)}`)

        let onload = [
            $(".ver-align"),
            $("#container")
        ]
        onload[0].removeClass("opac0")
    })
    
    function hideWelcome() {
        let element = [
            $(".ver-align"),
            $("#container")
        ]
        
        element[0].addClass("opac0")
        setTimeout(() => {
            element[1].removeClass("hided")
            setTimeout(() => {
                element[0].remove()
                element[1].removeClass("opac0")
            }, 300 / 2)
        }, 300)
    }

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
                
                <button className="btn btn-danger btn-success" onClick={hideWelcome} id="skip">skip</button>
            </div>
        </>
    )
}