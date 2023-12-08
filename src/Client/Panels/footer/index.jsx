import React  from 'react'
import packageJson from '../../../../package.json'

export function FooterButton() {
    return (
        <>
            <div className="footer">
                <div>{packageJson.name} | v{packageJson.version} | By {packageJson.author}</div>
            </div>
        </>
    )
}