import React  from 'react'
import packageJson from '../../../../package.json'

function FooterButton() {
    return (
        <>
            <div className="footer">
                <n2>{packageJson.name} | v{packageJson.version} | By {packageJson.author}</n2>
            </div>
        </>
    )
}

export default FooterButton