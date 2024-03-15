"use client";
import React from "react";
import ReactQuill, { Quill } from "react-quill";
import EditorToolbar, { modules, formats } from "./EditorToolbar";
import "react-quill/dist/quill.snow.css";
import "./custom-quill.css";
import { Sapling } from "@saplingai/sapling-js/observer";
import { useEffect } from 'react';
import {addStyles,EditableMathField} from 'react-mathquill'
import ReactDOM from 'react-dom';
import katex from 'katex';
export const Editor = () => {
  const [value, setValue] = React.useState('');
  const handleChange = (value:string) => {
    setValue(value);
  };
  const quillRef = React.useRef();
  useEffect(() => {
    Sapling.init({
      key: '2J7D6F5JDX3HBH5UJB3CS0UA9W0HZORO',
      endpointHostname: 'https://api.sapling.ai',
      editPathname: '/api/v1/edits',
      advancedEdits: {
        advance_edits: true,
    },
      statusBadge: true,
      mode: 'dev',
    });

    // Ensure the Quill instance is initialized before observing
    if (quillRef.current) {
      const quillInstance = quillRef.current.getEditor();
      console.log(quillInstance);
      const contentEditable = quillInstance.root
     console.log(contentEditable);
      Sapling.observe(contentEditable);
    
    
        }
  });
/*
  useEffect(() => {
    // Function to handle the button click
    const handleButtonClick = (event: React.MouseEvent) => {
       if (event.target) {
         event.preventDefault();
         console.log("Button clicked");
   
         // LaTeX expression to render
         const latexExpression = '\\frac{1}{\\Bigl(\\sqrt{\\phi \\sqrt{5}}-\\phi\\Bigr) e^{\\frac25 \\pi}} = 1+\\frac{e^{-2\\pi}} {1+\\frac{e^{-4\\pi}} {1+\\frac{e^{-6\\pi}} {1+\\frac{e^{-8\\pi}} {1+\\ldots} } } }';
         const span = document.createElement('span');
         // Render the LaTeX expression to HTML using katex
         katex.render(latexExpression, span, {
          throwOnError: false,
        });
  
          console.log(katex.render(latexExpression, span));
         // Insert the rendered HTML into the Quill editor at the current cursor position
         if (quill.current) {
           const quillInstance = quill.current.getEditor();
           const range = quillInstance.getSelection(true);
           quillInstance.clipboard.dangerouslyPasteHTML(range.index, span.outerHTML);
         }
       }
    };
   
    // Add event listener to the document
    document.addEventListener('click', handleButtonClick);
   
    // Cleanup: Remove the event listener when the component unmounts
    return () => {
       document.removeEventListener('click', handleButtonClick);
    };
   }, []);
*/

useEffect(() => {
  if (quillRef.current) {
    const quill = quillRef.current.getEditor();

    // Function to render React components into placeholders
    const renderReactComponents = () => {
      const placeholders = document.querySelectorAll('.react-component-placeholder');
      placeholders.forEach((placeholder) => {
        // Check if the placeholder has already been rendered
      //  if (!placeholder.dataset.rendered) {
          // Render the React component into the placeholder
          ReactDOM.render(<EditableMathField />, placeholder);
          // Mark the placeholder as rendered
         // placeholder.dataset.rendered = 'true';
       //}
      });
    };

    // Use a MutationObserver to watch for changes in the Quill editor's content
    const observer = new MutationObserver(renderReactComponents);
    const editorContainer = quill.root.parentNode; // Assuming the Quill editor is directly inside the container
    observer.observe(editorContainer, { childList: true, subtree: true });

    // Cleanup function to disconnect the observer when the component unmounts
    return () => observer.disconnect();
  }
}, []);

   const handleKeyDown = (event:React.KeyboardEvent) => {
       if (event.key === "Tab") {
           event.preventDefault()
           setValue(value); 
       }
   };

   const handleEditorChange = (value:string) => {
       setValue(value);
   };

   // Handler to handle button clicked
   const handler = () => {
       // Implement your submit logic here
       console.log(value);
   };
  return (
    <div className="relative mx-auto max-w-5xl mt-10" >
      <EditorToolbar />
      <ReactQuill
				theme="snow"
				value={value}
				onChange={handleEditorChange}
				modules={modules}
				onKeyDown={handleKeyDown}
				formats={formats}
				className="text-gray-300"
			// Assign the quill ref to the ReactQuill component
       ref={quillRef}
			/>
   </div>
  );
};

export default Editor;
