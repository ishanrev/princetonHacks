import React from 'react'
import "./editor.css"

function Editor() {
    return (
        <div className="editor">
            <div className="editor-wrapper">
                <div className="code_editor" id="code-editor">

                </div>
            </div>
            <script src=".././editor-lib/js/editor.js"></script>
        </div>
    )
}

export default Editor