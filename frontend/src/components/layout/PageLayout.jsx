import React from 'react'

const PageLayout = ({ children }) => {
    return (
        <div className="flex h-full w-full overflow-hidden" style={{ backgroundColor: "#0D1017" }}>
            <div className="flex-1 flex flex-col">
                <main className="flex-1 w-full">{children}</main>
            </div>
        </div>
    )
}

export default PageLayout