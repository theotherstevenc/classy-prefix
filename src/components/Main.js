import React, { useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { html } from '@codemirror/lang-html'

const Main = () => {
  const initialHTML = `
    <html>
      <head>
        <style>
          .example-class {
            color: red;
          }
          .example-class-2 {
            color: blue;
          }
          #example-id-1 {
            color: blue;
          }

        </style>
        <style>
          .alt-class {
            color: red;
          }
          .alt-class-2 {
            color: blue;
          }
          #alt-id-1 {
            color: blue;
          }
        </style>
      </head>
      <body>
        <div class="example-class" id="example-id">Hello, world!</div>
      </body>
    </html>
`
  const [inputString, setInputString] = useState('prefix-test')
  const [inputMarkup, setInputMarkup] = useState(initialHTML)
  const [outputMarkup, setOutputMarkup] = useState('')

  const handleApplyPrefix = (html, prefix) => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const attributes = ['class', 'id']

    const prefixAttributeValues = (targetAttributeValue) => {
      doc.querySelectorAll(`[${targetAttributeValue}]`).forEach((element) => {
        const currentValues = element.getAttribute(`${targetAttributeValue}`).split(' ')
        const prefixedValues = currentValues.map((value) => `${prefix}-${value}`)
        element.setAttribute(`${targetAttributeValue}`, prefixedValues.join(' '))
      })
    }

    attributes.forEach((attribute) => {
      prefixAttributeValues(attribute)
    })

    doc.querySelectorAll('style').forEach((styleElement) => {
      styleElement.innerHTML = styleElement.innerHTML.replace(/(\.)([a-zA-Z0-9_-]+)(\s*\{)/g, `$1${prefix}-$2$3`).replace(/(\#)([a-zA-Z0-9_-]+)(\s*\{)/g, `$1${prefix}-$2$3`)
    })

    console.log(doc.documentElement.outerHTML)
    setOutputMarkup(doc.documentElement.outerHTML)
  }
  const onChange = React.useCallback((value, viewUpdate) => {
    setInputMarkup(value)
    console.log('value:', value)
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
        <CodeMirror options={{ lineWrapping: true }} value={inputMarkup} onChange={onChange} extensions={[html()]} style={{ fontSize: 22 }} />
        <CodeMirror options={{ lineWrapping: true }} value={outputMarkup} extensions={[html()]} style={{ fontSize: 22 }} />
      </div>
    </div>
  )
}

export default Main
