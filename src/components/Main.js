import React, { useState, useCallback } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { langs } from '@uiw/codemirror-extensions-langs'
import { EditorView } from 'codemirror'
import SplitPane from 'react-split-pane'

const Main = () => {
  const [inputString, setInputString] = useState('')
  const [inputMarkup, setInputMarkup] = useState('')
  const [outputMarkup, setOutputMarkup] = useState('')

  const handleApplyPrefix = (html, prefix) => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const attributes = ['class', 'id']

    const prefixAttributeValues = (targetAttributeValue) => {
      doc.querySelectorAll(`[${targetAttributeValue}]`).forEach((element) => {
        const currentValues = element.getAttribute(`${targetAttributeValue}`).split(' ')
        const prefixedValues = currentValues.map((value) => `${prefix}${value}`)
        element.setAttribute(`${targetAttributeValue}`, prefixedValues.join(' '))
      })
    }

    attributes.forEach((attribute) => {
      prefixAttributeValues(attribute)
    })

    doc.querySelectorAll('style').forEach((styleElement) => {
      styleElement.innerHTML = styleElement.innerHTML.replace(/(\.)([a-zA-Z0-9_-]+)(\s*\{)/g, `$1${prefix}$2$3`).replace(/(\#)([a-zA-Z0-9_-]+)(\s*\{)/g, `$1${prefix}$2$3`)
    })

    console.log(doc.documentElement.outerHTML)
    setOutputMarkup(doc.documentElement.outerHTML)
  }

  const onChange = useCallback((value) => {
    setInputMarkup(value)
  }, [])

  return (
    <div className='prefixer-container'>
      <div className='input-container'>
        <input
          type='text'
          value={inputString}
          onChange={(event) => {
            setInputString(event.target.value)
          }}
        />

        <button
          type='button'
          onClick={() => {
            handleApplyPrefix(inputMarkup, inputString)
          }}
        >
          Apply Prefix
        </button>
      </div>
      <div className='textarea-container'>
        <SplitPane split='vertical'>
          <CodeMirror
            onChange={onChange}
            value={inputMarkup}
            basicSetup={{
              lineNumbers: true,
            }}
            extensions={[langs.html(), EditorView.lineWrapping]}
          />
          <CodeMirror
            value={outputMarkup}
            basicSetup={{
              lineNumbers: true,
            }}
            extensions={[langs.html(), EditorView.lineWrapping]}
          />
        </SplitPane>
      </div>
    </div>
  )
}

export default Main
