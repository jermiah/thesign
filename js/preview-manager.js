/**
 * Preview Manager
 * Handles live preview and code viewing of generated applications
 */

class PreviewManager {
    constructor(previewContainerId, codeViewerId) {
        this.previewContainer = document.getElementById(previewContainerId);
        this.codeViewer = document.getElementById(codeViewerId);
        this.currentFile = null;
        this.files = [];
        this.previewMode = 'live'; // 'live' or 'code'
    }
    
    loadFiles(files) {
        this.files = files;
        if (files.length > 0) {
            this.showFile(files[0].path);
        }
    }
    
    showFile(filePath) {
        const file = this.files.find(f => f.path === filePath);
        
        if (!file) {
            console.error('File not found:', filePath);
            return;
        }
        
        this.currentFile = file;
        
        if (this.previewMode === 'live') {
            this.showLivePreview(file);
        } else {
            this.showCodeView(file);
        }
    }
    
    showLivePreview(file) {
        if (!this.previewContainer) return;
        
        // Clear previous content
        this.previewContainer.innerHTML = '';
        
        if (file.path.endsWith('.html')) {
            // Create iframe for HTML preview
            const iframe = document.createElement('iframe');
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.style.background = 'white';
            
            this.previewContainer.appendChild(iframe);
            
            // Build complete HTML with all files
            const completeHTML = this.buildCompleteHTML(file);
            
            // Write to iframe
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(completeHTML);
            iframeDoc.close();
            
        } else if (file.path.endsWith('.css')) {
            // Show CSS with syntax highlighting
            this.showCodeView(file);
            
        } else if (file.path.endsWith('.js')) {
            // Show JavaScript with syntax highlighting
            this.showCodeView(file);
            
        } else if (file.path.endsWith('.md')) {
            // Render markdown
            this.showMarkdown(file);
            
        } else {
            // Show as plain text
            this.showCodeView(file);
        }
    }
    
    buildCompleteHTML(htmlFile) {
        let html = htmlFile.content;
        
        // Inject CSS files
        const cssFiles = this.files.filter(f => f.path.endsWith('.css'));
        if (cssFiles.length > 0) {
            const cssContent = cssFiles.map(f => f.content).join('\n\n');
            const styleTag = `<style>\n${cssContent}\n</style>`;
            
            // Insert before </head> or at the beginning
            if (html.includes('</head>')) {
                html = html.replace('</head>', `${styleTag}\n</head>`);
            } else {
                html = styleTag + html;
            }
        }
        
        // Inject JS files
        const jsFiles = this.files.filter(f => f.path.endsWith('.js'));
        if (jsFiles.length > 0) {
            const jsContent = jsFiles.map(f => f.content).join('\n\n');
            const scriptTag = `<script>\n${jsContent}\n</script>`;
            
            // Insert before </body> or at the end
            if (html.includes('</body>')) {
                html = html.replace('</body>', `${scriptTag}\n</body>`);
            } else {
                html = html + scriptTag;
            }
        }
        
        return html;
    }
    
    showCodeView(file) {
        if (!this.codeViewer) return;
        
        this.codeViewer.innerHTML = '';
        
        // Create code display
        const pre = document.createElement('pre');
        pre.style.margin = '0';
        pre.style.padding = '20px';
        pre.style.background = '#0a0a0a';
        pre.style.color = '#ffffff';
        pre.style.overflow = 'auto';
        pre.style.height = '100%';
        pre.style.fontFamily = 'Monaco, Courier New, monospace';
        pre.style.fontSize = '14px';
        pre.style.lineHeight = '1.6';
        
        const code = document.createElement('code');
        code.textContent = file.content;
        
        // Add line numbers
        const lines = file.content.split('\n');
        const numberedContent = lines.map((line, index) => {
            const lineNum = (index + 1).toString().padStart(4, ' ');
            return `<span style="color: #666; user-select: none;">${lineNum}</span>  ${this.escapeHtml(line)}`;
        }).join('\n');
        
        code.innerHTML = numberedContent;
        pre.appendChild(code);
        this.codeViewer.appendChild(pre);
        
        // Apply syntax highlighting
        this.applySyntaxHighlighting(code, file.path);
    }
    
    showMarkdown(file) {
        if (!this.previewContainer) return;
        
        // Simple markdown rendering
        let html = file.content;
        
        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        
        // Bold
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Italic
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Lists
        html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
        
        // Code blocks
        html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
        
        // Inline code
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Line breaks
        html = html.replace(/\n/g, '<br>');
        
        const container = document.createElement('div');
        container.style.padding = '20px';
        container.style.background = 'white';
        container.style.color = '#333';
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.lineHeight = '1.6';
        container.innerHTML = html;
        
        this.previewContainer.innerHTML = '';
        this.previewContainer.appendChild(container);
    }
    
    applySyntaxHighlighting(codeElement, filePath) {
        // Basic syntax highlighting
        let html = codeElement.innerHTML;
        
        if (filePath.endsWith('.html')) {
            // HTML highlighting
            html = html.replace(/(&lt;\/?[a-z][a-z0-9]*)/gi, '<span style="color: #e06c75;">$1</span>');
            html = html.replace(/([a-z-]+)=/gi, '<span style="color: #d19a66;">$1</span>=');
            html = html.replace(/"([^"]*)"/g, '<span style="color: #98c379;">"$1"</span>');
            
        } else if (filePath.endsWith('.css')) {
            // CSS highlighting
            html = html.replace(/([a-z-]+):/gi, '<span style="color: #d19a66;">$1</span>:');
            html = html.replace(/#[0-9a-f]{3,6}/gi, '<span style="color: #98c379;">$&</span>');
            html = html.replace(/\{|\}/g, '<span style="color: #e06c75;">$&</span>');
            
        } else if (filePath.endsWith('.js')) {
            // JavaScript highlighting
            const keywords = ['const', 'let', 'var', 'function', 'class', 'if', 'else', 'for', 'while', 'return', 'async', 'await', 'import', 'export', 'default'];
            keywords.forEach(keyword => {
                const regex = new RegExp(`\\b${keyword}\\b`, 'g');
                html = html.replace(regex, `<span style="color: #c678dd;">${keyword}</span>`);
            });
            
            html = html.replace(/"([^"]*)"/g, '<span style="color: #98c379;">"$1"</span>');
            html = html.replace(/'([^']*)'/g, '<span style="color: #98c379;">\'$1\'</span>');
            html = html.replace(/\/\/(.*)/g, '<span style="color: #5c6370;">//$1</span>');
        }
        
        codeElement.innerHTML = html;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    setPreviewMode(mode) {
        this.previewMode = mode;
        if (this.currentFile) {
            this.showFile(this.currentFile.path);
        }
    }
    
    refresh() {
        if (this.currentFile) {
            this.showFile(this.currentFile.path);
        }
    }
    
    clear() {
        if (this.previewContainer) {
            this.previewContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666;">No preview available</div>';
        }
        if (this.codeViewer) {
            this.codeViewer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666;">No code to display</div>';
        }
        this.currentFile = null;
        this.files = [];
    }
}

// Export for use in main application
window.PreviewManager = PreviewManager;
