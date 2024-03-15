
import React, { useEffect, useMemo, useState, useRef, useContext } from "react";
import ReactQuill, { Quill} from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./custom-quill.css";
import { paraphrase, summarize,advanced_check,pdf, autoncomplete} from "@/utils/helpers";
import { addStyles, EditableMathField,StaticMathField} from 'react-mathquill';
import Select from 'react-select';


const CustomUndo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
    <path
      className="ql-stroke"
      d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"
    />
  </svg>
);

const Customparphrase = () => (
    <svg viewBox="0  0  24  24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12  22c-2.206  0-4-1.794-4-4h8c0  2.206-1.794  4-4  4zm0-14c-2.206  0-4  1.794-4  4h8c0-2.206-1.794-4-4-4zm0  14c-2.206  0-4  1.794-4  4h8c0-2.206-1.794-4-4-4z"></path>
    <path d="M12  2c-2.206  0-4  1.794-4  4v12c0  2.206  1.794  4  4  4h8c2.206  0  4-1.794  4-4v-12c0-2.206-1.794-4-4-4zm0  14c-2.206  0-4  1.794-4  4h8c2.206  0  4-1.794  4-4v-12c0-2.206-1.794-4-4-4z"></path>
    <path d="M12  2c-2.206  0-4  1.794-4  4v12c0  2.206  1.794  4  4  4h8c2.206  0  4-1.794  4-4v-12c0-2.206-1.794-4-4-4zm0  14c-2.206  0-4  1.794-4  4h8c2.206  0  4-1.794  4-4v-12c0-2.206-1.794-4-4-4z"></path>
  </svg>);
  const Customsummarize = () => (
    <svg viewBox="0  0  24  24" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path d="M12  2C6.48  2  2  6.48  2  12C2  17.52  6.48  22  12  22C17.52  22  22  17.52  22  12C22  6.48  17.52  2  12  2ZM12  20C7.59  20  4  16.41  4  12C4  7.59  7.59  4  12  4C16.41  4  20  7.59  20  12C20  16.41  16.41  20  12  20ZM12  16C10.34  16  9  14.66  9  13C9  11.34  10.34  10  12  10C13.66  10  15  11.34  15  13C15  14.66  13.66  16  12  16ZM12  10C13.1  10  14  9.1  14  8C14  6.9  13.1  6  12  6C10.9  6  10  6.9  10  8C10  9.1  10.9  10  12  10ZM12  4C13.1  4  14  3.1  14  2C14  0.9  13.1  0  12  0C10.9  0  10  0.9  10  2C10  3.1  10.9  4  12  4Z" fill="currentColor"/>
  </svg>);
 const DownloadPdfIcon = () => (
  <svg viewBox="0  0  24  24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12  2C6.48  2  2  6.48  2  12C2  17.52  6.48  22  12  22C17.52  22  22  17.52  22  12C22  6.48  17.52  2  12  2ZM12  18C14.3137  18  16  16.3137  16  14C16  11.6863  14.3137  10  12  10C9.6863  10  8  11.6863  8  14C8  16.3137  9.6863  18  12  18ZM12  16C13.1  16  14  14.9  14  13.5C14  12.1  13.1  11  12  11C10.9  11  10  11.9  10  13.5C10  14.9  10.9  16  12  16ZM12  14C12.5523  14  13  13.4477  13  12.9167C13  12.3853  12.5523  12  12  12C11.4477  12  11  12.3853  11  12.9167C11  13.4477  11.4477  14  12  14ZM12  12C12.5523  12  13  11.4477  13  10.9167C13  10.3853  12.5523  10  12  10C11.4477  10  11  10.3853  11  10.9167C11  11.4477  11.4477  12  12  12Z" fill="currentColor"/>
  </svg>
);

// Redo button icon component for Quill editor
const CustomRedo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
    <path
      className="ql-stroke"
      d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"
    />
  </svg>
);


// Undo and redo functions for Custom Toolbar
function undoChange() {
    this.quill.history.undo();
  }
  function redoChange() {
    this.quill.history.redo();
  }
  function red() {
    // Dynamically include KaTeX
    const katexStylesheet = document.createElement('link');
    katexStylesheet.href = "https://cdn.jsdelivr.net/npm/katex@0.13.18/dist/katex.min.css";
    katexStylesheet.rel = "stylesheet";
    document.head.appendChild(katexStylesheet);

    const katexScript = document.createElement('script');
    katexScript.src = "https://cdn.jsdelivr.net/npm/katex@0.13.18/dist/katex.min.js";
    document.head.appendChild(katexScript);
  }      
function insertTable() {
  // Create a new table element
  const rows = 3;
  const columns = 3;
  const editor = document.querySelector(".ql-editor"); // Adjust this selector to match your editor
 
  // Create a new table element
  const table = document.createElement('table');
  table.style.backgroundColor = 'red';
  // Loop through the number of rows to create each row
  for (let i = 0; i < rows; i++) {
       const row = document.createElement('tr');
       table.appendChild(row);
 
       // Loop through the number of columns to create each cell
       for (let j = 0; j < columns; j++) {
           const cell = document.createElement('td');
           cell.textContent = `Cell ${i + 1}-${j + 1}`; // Example content
           row.appendChild(cell);
       }
  }
 
  // Append the table to the editor
  editor?.appendChild(table);
 }
 const complete =  async function () {
  const editor = document.querySelector(".ql-editor");
  const button = document.querySelector(".ql-completebtn") as HTMLButtonElement;
  if (editor) {
    // Get the current selection
    const selection = window.getSelection();
    if (selection && selection.toString().length >  0) {
      // Save the current selection range
      const range = selection.getRangeAt(0);
      // Disable the button to prevent multiple clicks
      button.disabled = true;
      // Paraphrase the selected text
      const paraphrasedContent = await autoncomplete(selection.toString());
      // Replace the selected text with the paraphrased content
      range.deleteContents(); // Remove the selected text
      const textNode = document.createTextNode(paraphrasedContent); // Create a new text node with the paraphrased content
      range.insertNode(textNode); // Insert the new text node at the selection's position
      // Re-enable the button
      button.disabled = false;
    } else {
      const content = editor.innerHTML;
      console.log(content);
      button.disabled = true;
      const paraphrasedContent = await autoncomplete(content);
      editor.innerHTML = paraphrasedContent;
      button.disabled = false;
    }
  }
}
   
   
  const paraphras =  async function () {
    const editor = document.querySelector(".ql-editor");
    const button = document.querySelector(".ql-paraphrasebtn") as HTMLButtonElement;
    if (editor) {
      // Get the current selection
      const selection = window.getSelection();
      if (selection && selection.toString().length >  0) {
        // Save the current selection range
        const range = selection.getRangeAt(0);
        // Disable the button to prevent multiple clicks
        button.disabled = true;
        // Paraphrase the selected text
        const paraphrasedContent = await paraphrase(selection.toString());
        // Replace the selected text with the paraphrased content
        range.deleteContents(); // Remove the selected text
        const textNode = document.createTextNode(paraphrasedContent); // Create a new text node with the paraphrased content
        range.insertNode(textNode); // Insert the new text node at the selection's position
        // Re-enable the button
        button.disabled = false;
      } else {
        const content = editor.innerHTML;
        console.log(content);
        button.disabled = true;
        const paraphrasedContent = await paraphrase(content);
        editor.innerHTML = paraphrasedContent;
        button.disabled = false;
      }
    }
  }
  const summariz =  async function () {
    const editor = document.querySelector(".ql-editor");
    const button = document.querySelector(".ql-paraphrasebtn") as HTMLButtonElement;
    if (editor) {
      // Get the current selection
      const selection = window.getSelection();
      if (selection && selection.toString().length >  0) {
        // Save the current selection range
        const range = selection.getRangeAt(0);
        // Disable the button to prevent multiple clicks
        button.disabled = true;
        // Paraphrase the selected text
        const paraphrasedContent = await summarize(selection.toString());
        // Replace the selected text with the paraphrased content
        range.deleteContents(); // Remove the selected text
        const textNode = document.createTextNode(paraphrasedContent); // Create a new text node with the paraphrased content
        range.insertNode(textNode); // Insert the new text node at the selection's position
        // Re-enable the button
        button.disabled = false;
      } else {
        const content = editor.innerHTML;
        console.log(content);
        button.disabled = true;
        const paraphrasedContent = await summarize(content);
        editor.innerHTML = paraphrasedContent;
        button.disabled = false;
      }
    }
  }

 
const saveAspdf = async () => {
const editor = document.querySelector(".ql-editor");
const s = await pdf(editor?.innerHTML);
console.log(s);
const {download_url} = s;
console.log(download_url);

  // Fetch the file as a blob
  const response = await fetch(download_url);
  const blob = await response.blob();

  // Create a temporary anchor element
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'filename.pdf'; // Specify the filename you want to download as

  // Append the anchor element to the body
  document.body.appendChild(a);

  // Trigger the download
  a.click();

  // Clean up by removing the anchor element and revoking the object URL
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href)
};
// Add sizes to whitelist and register them
const Size = Quill.import("formats/size");
Size.whitelist = ["extra-small", "small", "medium", "large"];
Quill.register(Size, true);


// Add fonts to whitelist and register them

const Font = Quill.import("formats/font");
Font.whitelist = [
  "arial",
  "comic-sans",
  "courier-new",
  "georgia",
  "helvetica",
  "lucida",
  "Roboto"
];
Quill.register(Font, true);


// Modules object for setting up the Quill editor
export const modules = {
  toolbar: {
    container: "#toolbar",
    handlers: {
      undo: undoChange,
      redo: redoChange,
      paraphrasebtn: paraphras,
      summarizebtn: summariz,
      savebtn: saveAspdf,
      completebtn:complete
      //tab: insertTable
      //sav: red
    }
  },
  history: {
    delay: 500,
    maxStack: 100,
    userOnly: true
  }
};
addStyles();
// Formats objects for setting up the Quill editor
export const formats = [
  "header",
  "size",
  "bold",
  "italic",
  "underline",
  "align",
  "strike",
  "script",
  "blockquote",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "color",
  "code-block",
  "paraphrasebtn",
  "summarizebtn",
  "formula",
  "font",
  "forms",
  "savebtn",
  "sav",
  "completebtn"

];
const options = [
  { value: 'f(x)=x^2', label: 'Quadratic Function' },
  { value: '\\frac{1}{2}x^2 - x + 1', label: 'Parabola Equation' },
  { value: '\\int_{a}^{b} f(x) \, dx', label: 'integration' },
  { value: '\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}', label: 'Sum' },
  { value: '\\>', label: 'greater' },
  { value: '\\<', label: 'less' },
  { value: '\\\geq', label: 'greater or equal' },
  { value: '\\\leq', label: 'less or equal' },
  { value: '\\\product_{n=1}^{\\infty}', label: 'prpduct' },
  { value: '\\f^{-1}(x)', label: 'inverse' },
  { value: '\\\sqrt[n]{a}', label: 'sqrt' },
  { value: '\\frac{a}{b}', label: 'fraction' },
  { value: '\\\log_b(x)', label: 'logaritimic function' },
  { value: '\\\ln(x)', label: 'ln' },]
  const options2 = [
    { value: '\\alpha', label: 'alpha' },
    { value: '\\omega', label: 'omega' },
    { value: '\\epsilon', label: 'epsilon' },
    { value: '\\beta', label: 'beta' },
    { value: '\\gamma', label: 'gamma' },
    { value: '\\delta', label: 'delta' },
    { value: '\\sigma', label: 'sigma' },
    { value: '\\theta', label: 'thata' },
    { value: '\\mu', label: 'mu' },
    { value: '\\nu', label: 'nu' },
    { value: '\\Gamma', label: 'Gamma' },
    { value: '\\phi', label: 'phi' },
    { value: '\\eta', label: 'etha' },
    { value: '\\tau', label: 'Tau' },
    { value: '\\rho', label: 'rho' },
 ];
 

// Quill Toolbar component
export const QuillToolbar = () => {
    const [selectedFont, setSelectedFont] = useState("arial");
    const [latex, setLatex] = useState('\\frac{1}{\\sqrt{2}}\\cdot 2')
    const [eq, seteq] = useState(false)
    //const quill = useContext(QuillContext);
    const handleChange = (selectedOption) => {
      console.log(selectedOption.value);
      setLatex(latex+selectedOption.value);
   };
  
    // Function to handle font change
    const handleFontChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedFont(event.target.value);
       console.log(selectedFont);
    };
     // Function to handle font change
     const handleq = () => {
      console.log('done');
      seteq(true);
      red();
    };
    const handleqd = () => {
      console.log('done');
      setLatex('');
      red();
    };
        
     
  
 return(
  <div id="toolbar">
    <span className="ql-formats">
      <select className="ql-font">
        <option value="arial">Arial</option>
        <option value="comic-sans">Comic Sans</option>
        <option value="courier-new">Courier New</option>
        <option value="georgia">Georgia</option>
        <option value="helvetica">Helvetica</option>
        <option value="lucida">Lucida</option>
        <option value="Roboto">Roboto</option>
      </select>
      <select className="ql-size" defaultValue="medium">
        <option value="extra-small">Size 1</option>
        <option value="small">Size 2</option>
        <option value="medium">Size 3</option>
        <option value="large">Size 4</option>
      </select>
      <select className="ql-header" defaultValue="3">
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
        <option value="4">Heading 4</option>
        <option value="5">Heading 5</option>
        <option value="6">Heading 6</option>
      </select>
    </span>
    <span className="ql-formats">
      <button className="ql-bold" />
      <button className="ql-italic" />
      <button className="ql-underline" />
      <button className="ql-strike" />
    </span>
    <span className="ql-formats">
      <button className="ql-list" value="ordered" />
      <button className="ql-list" value="bullet" />
      <button className="ql-indent" value="-1" />
      <button className="ql-indent" value="+1" />
    </span>
    <span className="ql-formats">
      <button className="ql-script" value="super" />
      <button className="ql-script" value="sub" />
      <button className="ql-blockquote" />
      <button className="ql-direction" />
    </span>
    <span className="ql-formats">
      <select className="ql-align" />
      <select className="ql-color" />
      <select className="ql-background" />
    </span>
    <span className="ql-formats">
      <button className="ql-link" />
      <button className="ql-image" />
    </span>
    <span className="ql-formats">
      <button className="ql-code-block" />
      <button className="ql-clean" />
    </span>
      <button className="ql-undo">
        <CustomUndo />
      </button>
      <button className="ql-redo">
        <CustomRedo />
      </button>
      <span className="ql-formats">
      <button className="ql-paraphrasebtn">
        <Customparphrase />
      </button>
      <button className="ql-summarizebtn">
        <Customsummarize />
      </button>
      <button className="ql-savebtn">
        <DownloadPdfIcon />
      </button>
      <button className="ql-completebtn">
        <DownloadPdfIcon />
      </button>
      <button className="ql-sav" onClick={handleqd}>
        <DownloadPdfIcon />
      </button>
      <EditableMathField
        latex={latex}
        onChange={(mathField) => {
          setLatex(mathField.latex())
        }}
      />
      <Select
      options={options}
      onChange={handleChange}
      components={{
        Option: (props) => (
          <div {...props.innerProps}>
            <StaticMathField>{props.data.value}</StaticMathField>
            <div>{props.data.label}</div>
          </div>
        ),
      }}
    />
     <Select
      options={options2}
      onChange={handleChange}
      components={{
        Option: (props) => (
          <div {...props.innerProps}>
            <StaticMathField>{props.data.value}</StaticMathField>
            <div>{props.data.label}</div>
          </div>
        ),
      }}
    />
      <button className="ql-formula" onClick={handleq}>
      </button>
    </span>

  </div>
 );}

export default QuillToolbar;