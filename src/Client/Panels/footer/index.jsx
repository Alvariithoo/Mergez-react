import React  from 'react'
import packageJson from '../../../../package.json'

export function FooterButton() {
    return (
        <>
            <div className="footer">{packageJson.name} | v{packageJson.version} | By {packageJson.author}</div>
        </>
    )
}