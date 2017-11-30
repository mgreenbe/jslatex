import React, { Component } from 'react';
import { regexes } from './regexes.js';
import { tokenize } from './tokenize.js';
import { parse } from './parse.js';
import { renderNode } from './render.js';

let tex = `


Hi, mom!

\\section{Dude section}

Yo, dude!
Yo, man!

\\subsection{Blah blah}

Subsection content.

\\subsection{Bleh bleh}
Second subsection

content.
\\section{Dude, again}

Dude!

`;

let renderHTML = tex => renderNode(parse(tokenize(regexes, tex)));

let tree = tex => JSON.stringify(parse(tokenize(regexes, tex)), null, 2);

class App extends Component {
  state = { tex, html: renderHTML(tex), tree: tree(tex) };
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleClick = () => {
    let { tex } = this.state;
    this.setState({ html: renderHTML(tex), tree: tree(tex) });
  };
  render() {
    return (
      <div>
        <div style={{ display: 'flex', margin: 30 }}>
          <div style={{ flexGrow: 1, flexShrink: 0 }}>
            <div>
              <textarea
                value={this.state.tex}
                name="tex"
                onChange={this.handleChange}
                rows={30}
                style={{ width: '95%' }}
              />
            </div>
            <button onClick={this.handleClick} style={{ width: '95%' }}>
              Render
            </button>
          </div>
          <div
            style={{
              flexGrow: 1,
              flexShrink: 0,
              padding: 10,
              backgroundColor: 'papayawhip'
            }}
            dangerouslySetInnerHTML={{ __html: this.state.html }}
          />
        </div>
        <pre>{this.state.tree}</pre>
      </div>
    );
  }
}

export default App;
